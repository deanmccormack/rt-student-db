const validator = require('validator');

const TrimmedStringType = {
  type: String,
  trim: true,
};

const RequiredStringType = {
  ...TrimmedStringType,
  required: true,
};

const EmailType = {
  ...RequiredStringType,
  unique: true,
  validate: [validator.isEmail, 'invalid email'],
};

const PhoneType = {
  type: String,
  trim: true,
  validate: [validator.isMobilePhone, 'invalid phone number'],
};

const DOBType = {
  type: Date,
  required: true,
};

const EmergencyContactType = {
  name: RequiredStringType,
  num: PhoneType,
};

const AddressType = {
  streetAddress: TrimmedStringType,
  addr2: TrimmedStringType,
  city: TrimmedStringType,
  state: TrimmedStringType,
  postalCode: TrimmedStringType,
  cc: RequiredStringType,
};

module.exports = {
  RequiredStringType,
  EmailType,
  PhoneType,
  DOBType,
  EmergencyContactType,
  AddressType,
};
