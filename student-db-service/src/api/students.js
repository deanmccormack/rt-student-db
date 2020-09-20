const auth = require('basic-auth');
const compare = require('tsscmp');

const { Router } = require('express');
const RateLimit = require('express-rate-limit');

const Student = require('../models/student');

const DefaultStudentFields = [
  'firstName',
  'lastName',
  'address',
  'email',
  'phone',
  'dob',
  'emergencyContact',
  'classes',
];

const DefaultSort = {
  lastName: 'asc',
};

// Attempt to limit spam post requests for inserting data
const minutes = 5;
const postLimiter = new RateLimit({
  windowMs: minutes * 60 * 1000, // milliseconds
  max: 100, // Limit each IP to 100 requests per windowMs
  delayMs: 0, // Disable delaying - full speed until the max limit is reached
  handler: (req, res) => {
    res.status(429).json({ success: false, msg: `You made too many requests. Please try again after ${minutes} minutes.` });
  },
});

async function checkAuth(req, res, next) {
  const check = (name, pass) => compare(name, process.env.USER)
    && compare(pass, process.env.USER_PW);

  const credentials = auth(req);

  if (!credentials || !check(credentials.name, credentials.pass)) {
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'students');
    res.end('Access denied');
  } else {
    next();
  }
}

// Get By ID
async function getStudent(req, res, next) {
  let student;
  console.log('get a student');
  try {
    student = await Student.findById(req.params.id);
    if (student === null) {
      return res.status(404).json({ message: 'Cannot find subscriber' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.student = student;
  return next();
}

const router = Router();

const getViewingMsg = (offset, viewTotal, totalRecs) => {
  const [startAt, endAt] = offset >= totalRecs
    ? [0, 0]
    : [offset, offset + viewTotal];

  return `records ${startAt}-${endAt} of ${totalRecs}`;
};

router.get('/:id', getStudent, (req, res) => {
  res.json(res.student);
});

// GET Page
router.get('/', checkAuth, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10);
    const sort = DefaultSort;
    const limit = 10;

    const offset = page
      ? page * limit
      : 0;

    const students = await Student.find()
      .select(DefaultStudentFields)
      .limit(limit)
      .skip(offset)
      .sort(sort);

    const cnt = await Student.countDocuments({});

    res.status(200).json({
      message: `Query parameters: page = ${page}`,
      totalPages: Math.ceil(cnt / limit),
      viewing: getViewingMsg(offset, students.length, cnt),
      sort: DefaultSort,
      limit,
      currentPageSize: students.length,
      students,
      totalCount: cnt,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
    next(error);
  }
});

// CREATE one
router.post('/', postLimiter, async (req, res) => {
  const student = new Student({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    address: req.body.address,
    email: req.body.email,
    phone: req.body.phone,
    dob: req.body.dob,
    emergencyContact: req.body.emergencyContact,
    classes: req.body.classes,
  });
  try {
    const createdEntry = await student.save();
    res.status(201).json(createdEntry);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(422).json({
        message: error.message,
      });
    } else {
      res.status(400).json({
        message: error.message,
      });
    }
  }
});

// UPDATE one
router.patch('/:id', getStudent, async (req, res) => {
  Object.keys(req.body).forEach((prop) => {
    res.student[prop] = req.body[prop];
  });
  try {
    const updatedStudent = await res.student.save();
    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// DELETE one
router.delete('/:id', getStudent, async (req, res) => {
  try {
    await res.student.remove();
    res.json({ message: 'Deleted Student' });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
