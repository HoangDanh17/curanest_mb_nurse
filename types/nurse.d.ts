export interface NurseProfile {
  id: string;
  role: "nurse";
  "full-name": string;
  email: string;
  "phone-number": string;
  "created-at": string;
  "nurse-id": string;
  "nurse-picture": string;
  "nurse-name": string;
  gender: boolean;
  dob: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  "current-work-place": string;
  "education-level": string;
  experience: string;
  certificate: string;
  "google-drive-url": string;
  slogan: string;
  rate: string;
}

export type NurseDataRes = {
  status: number;
  data: NurseProfile;
};
