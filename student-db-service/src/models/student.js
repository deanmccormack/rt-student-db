const mongoose = require('mongoose');

const {
  RequiredStringType,
  EmailType,
  PhoneType,
  DOBType,
  EmergencyContactType,
  AddressType,
} = require('./field-types');

const StudentSchema = new mongoose.Schema({
  firstName: RequiredStringType,
  lastName: RequiredStringType,
  address: AddressType,
  email: EmailType,
  phone: PhoneType,
  dob: DOBType,
  emergencyContact: EmergencyContactType,
  classes: Array,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Student', StudentSchema);
