export interface LoginBodyType {
  "phone-number": string;
  password: string;
}

export interface LoginResType {
  data: {
    "account-info": {
      id: string;
      "full-name": string;
      "phone-number": string;
      email: string;
      role: string;
    };
    token: {
      access_token: string;
      access_token_exp_in: number;
    };
  };
  status: number;
}

export interface RegisterBodyType {
  "full-name": string;
  password: string;
  "phone-number": string;
  email: string | null;
}
export interface RegisterResType {
  message: string;
}

export interface UserDataType {
  id?: string;
  role: string;
  "full-name": string;
  email: string;
  "phone-number": string;
  avatar: string;
  "created-at": string;
  gender: boolean;
  dob: string;
  address: string;
  ward: string;
  district: string;
  city: string;
}

export interface UpdateUserDataType {
  address: string;
  avatar: string;
  city: string;
  district: string;
  dob: string;
  email: string;
  "full-name": string;
  gender: boolean;
  "phone-number": string;
  ward: string;
}

export type UserDataRes = {
  status: number;
  data: UserDataType;
};
