
export interface Credentials {
  email: string;
  pass: string;
}

export interface RegistrationFormData {
  fullName: string;
  entryNumber: string;
  phoneNumber: string;
  town: string;
  state: string;
  remarks?: string;
}
