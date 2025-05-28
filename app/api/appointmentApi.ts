import http from "@/lib/http";
import {
  AppointmentDetailRes,
  AppointmentListRes,
  AppointmentNotiRes,
  CreateAppointment,
  CreateAppointmentRes,
  GetReportRes,
  SubmitReport,
  SubmitReportRes,
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
  getAppointmentNoti: (id: string) =>
    http.get<AppointmentListRes>(`appointments?id=${id}`, {
      apiPrefix: "appointment",
    }),
  getListAppointmentHistory: (id: string) =>
    http.get<AppointmentListRes>(`appointments?nursing-id=${id}`, {
      apiPrefix: "appointment",
    }),
  getAppointmentDetail: (packageId: string, date: string) =>
    http.get<AppointmentDetailRes>(
      `cuspackage?cus-package-id=${packageId}&est-date=${date}`,
      { apiPrefix: "appointment" }
    ),
  startAppointment: (id: string) =>
    http.patch<CreateAppointmentRes>(
      `appointments/${id}/update-status-upcoming`,
      null,
      {
        apiPrefix: "appointment",
      }
    ),
  checkTaskDone: (id: string) =>
    http.patch<CreateAppointmentRes>(
      `cuspackage/custask/${id}/update-status-done`,
      null,
      {
        apiPrefix: "appointment",
      }
    ),
  getMedicalReport: (id: string) =>
    http.get<GetReportRes>(`medical-record/${id}`, {
      apiPrefix: "appointment",
    }),
  submitMedicalReport: (id: string, body: SubmitReport) =>
    http.patch<SubmitReportRes>(`medical-record/${id}`, body, {
      apiPrefix: "appointment",
    }),
};

export default appointmentApiRequest;
