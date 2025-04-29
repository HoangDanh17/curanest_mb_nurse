import http from "@/lib/http";
import {
  AppointmentDetailRes,
  AppointmentListRes,
  CreateAppointment,
  CreateAppointmentRes,
} from "@/types/appointment";

const appointmentApiRequest = {
  createAppointment: (body: CreateAppointment) =>
    http.post<CreateAppointmentRes>("cuspackage", body, {
      apiPrefix: "appointment",
    }),
  getListAppointment: (id: string, today: string, nextday: string) =>
    http.get<AppointmentListRes>(
      `appointments?nursing-id=${id}&est-date-from=${today}&est-date-to=${nextday}`,
      { apiPrefix: "appointment" }
    ),
  getListAppointmentHistory: (id: string) =>
    http.get<AppointmentListRes>(`appointments?nurse-id=${id}`, {
      apiPrefix: "appointment",
    }),
  getAppointmentDetail: (packageId: string, date: string) =>
    http.get<AppointmentDetailRes>(
      `cuspackage?cus-package-id=${packageId}&est-date=${date}`,
      { apiPrefix: "appointment" }
    ),
};

export default appointmentApiRequest;
