export interface Address {
  streetAddress: String;
  addr2: String;
  city: String;
  state: String;
  postalCode: String;
  cc: String;
};

export interface EmergencyContact {
  name: String;
  num: String;
};

export interface Student {
  firstName: String;
  lastName: String;
  phone: String;
  email: String;
  dob: Date;
  address: Address;
  emergencyContact: EmergencyContact;
  classes: Array<string>;
}
