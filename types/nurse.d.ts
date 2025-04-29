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

export type NurseData = {
  name: string;
  position: string;
  rating: number;
  reviews: number;
  location: string;
  experience: string;
  patientsChecked: number;
  slogan: string;
  image: string;
  services: string[];
};

export interface DayOfWeek {
  [key: string]: string;
}

export type AvailabilityData = {
  [key: string]: string[];
};

export type ListNurseData = {
  "nurse-id": string;
  "nurse-picture": string;
  "nurse-name": string;
  gender: boolean;
  "current-work-place": string;
  rate: number;
};

export type ListNurseDataRes = {
  status: number;
  data: ListNurseData[];
  filters: {
    "service-id": string;
    "nurse-name": string;
    rate: number;
  };
  paging: {
    page: number;
    size: number;
    total: number;
  };
};

export type DetailNurse = {
  "nurse-id": string;
  "nurse-picture": string;
  "nurse-name": string;
  gender: boolean;
  city: string;
  "current-work-place": string;
  "education-level": string;
  experience: string;
  certificate: string;
  slogan: string;
  rate: number;
};

export type DetailNurseRes = {
  status: number;
  data: DetailNurse;
};
