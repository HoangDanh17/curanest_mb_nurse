export interface Patient {
  id: string;
  "full-name": string;
  dob: string;
  "phone-number": string;
  address: string;
  ward: string;
  district: string;
  city: string;
  "desc-pathology": string;
  "note-for-nurse": string;
}

export interface CreatePatient {
  address: string;
  city: string;
  "desc-pathology": string;
  district: string;
  dob: string;
  "full-name": string;
  gender: boolean;
  "note-for-nurse": string;
  "phone-number": string;
  ward: string;
}

export type PatientRes = {
  status: number;
  data: Patient[];
};

export type PatientOneRes = {
  status: number;
  data: Patient;
};

export type CreatePatientRes = {
  status: number;
  message: string;
};
