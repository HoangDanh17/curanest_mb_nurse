import http from "@/lib/http";
import { CreatePatient, CreatePatientRes, PatientOneRes, PatientRes } from "@/types/patient";

const patientApiRequest = {
  getAllPatient: () =>
    http.get<PatientRes>("patients/relatives", { apiPrefix: "patient" }),
  getPatient: (id: string) =>
    http.get<PatientOneRes>(`patients/${id}`, { apiPrefix: "patient" }),
  createPatient: (body: CreatePatient) =>
    http.post<CreatePatientRes>("patients", body, { apiPrefix: "patient" }),
  updatePatient: (id: string | string[], body: CreatePatient) =>
    http.put<CreatePatientRes>(`patients/${id}`, body, {
      apiPrefix: "patient",
    }),
};

export default patientApiRequest;
