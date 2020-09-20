const faker = require('faker');
const Student = require('./student');

async function generateStudents({ empty = false }) {
  if (empty) {
    console.log('empty students');
    Student.deleteMany({}, (err) => console.log(err || 'empty'));
  }
  const cnt = await Student.countDocuments({});
  console.log(`student cnt=${cnt}`);

  if (cnt < 200) {
    const startCreate = new Date();
    const hrstartCreate = process.hrtime();

    try {
      for (let i = 0; i < 200; i += 1) {
        const student = new Student({
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          address: { cc: 'USA' },
          email: faker.internet.email(),
          phone: faker.phone.phoneNumberFormat(),
          dob: faker.date.past(),
          emergencyContact: {
            name: faker.name.findName(),
            num: faker.phone.phoneNumberFormat(),
          },
          classes: [faker.random.arrayElements()],
        });
        student.save();
      }
    } catch (error) {
      console.dir(error);
    }
    const endCreate = new Date() - startCreate;
    const hrendCreate = process.hrtime(hrstartCreate);
    console.info('Create Execution time: %dms', endCreate);
    console.info('Create Execution time (hr): %ds %dms', hrendCreate[0], hrendCreate[1] / 1000000);
  }
}

module.exports = generateStudents;
