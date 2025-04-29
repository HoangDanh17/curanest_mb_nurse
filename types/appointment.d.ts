import { ListNurseData } from "@/types/nurse";
import { GestureResponderEvent } from "react-native";

export type Status =
  | "waiting"
  | "confirmed"
  | "success"
  | "upcoming"
  | "changed";

export interface StatusStyle {
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  label: string;
}

export type AppointmentCardProps = {
  id: string | undefined;
  avatar: string | undefined;
  nurseName: string | undefined;
  time: string;
  status: Status;
  packageId: string;
  nurseId: string;
  patientId: string;
};

export type CreateAppointment = {
  dates: string[];
  "nursing-id"?: string;
  "patient-id": string;
  "svcpackage-id": string;
  "task-infos": {
    "client-note": string;
    "est-duration": number;
    "svctask-id": string;
    "total-cost": number;
    "total-unit": number;
  }[];
};

export type CreateAppointmentRes = {
  status: number;
  message: string;
};

export type AppointmentList = {
  id: string;
  "service-id": string;
  "cuspackage-id": string;
  "nursing-id": string;
  "patient-id": string;
  "patient-address": string;
  "patient-lat-lng": string;
  "est-date": string;
  "act-date": string;
  status: Status;
  "total-est-duration": number;
  "created-at": string;
};

export type AppointmentListNurse = {
  id: string;
  "service-id": string;
  "cuspackage-id": string;
  "nursing-id": string;
  "patient-id": string;
  "est-date": string;
  "act-date": string;
  status: Status;
  "created-at": string;
  nurse: ListNurseData | null;
};

export type AppointmentListRes = {
  status: number;
  data: AppointmentList[];
  filters: {
    "service-id": string;
  };
};

export type AppointmentDetail = {
  package: {
    id: string;
    name: string;
    "total-fee": number;
    "paid-amount": number;
    "unpaid-amount": number;
    "payment-status": string;
    "created-at": string;
  };
  tasks: {
    id: string;
    "task-order": number;
    name: string;
    "client-note": string;
    "staff-advice": string;
    "est-duration": number;
    unit: string;
    "total-unit": number;
    status: string;
    "est-date": string;
  }[];
};

export type AppointmentDetailRes = {
  status: number;
  data: AppointmentDetail;
};
