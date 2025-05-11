import http from "@/lib/http";
import {
  AppointmentDetailRes,
  AppointmentListRes,
  CreateAppointment,
  CreateAppointmentRes,
  GetReportRes,
  StartAppointment,
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
  getListAppointmentHistory: (id: string) =>
    http.get<AppointmentListRes>(`appointments?nurse-id=${id}`, {
      apiPrefix: "appointment",
    }),
  getAppointmentDetail: (packageId: string, date: string) =>
    http.get<AppointmentDetailRes>(
      `cuspackage?cus-package-id=${packageId}&est-date=${date}`,
      { apiPrefix: "appointment" }
    ),
  startAppointment: (body: StartAppointment) =>
    http.patch<CreateAppointmentRes>(
      `appointments/${body["appointment-id"]}/update-status-upcoming}`,
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
