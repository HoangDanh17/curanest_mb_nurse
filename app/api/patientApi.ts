import http from "@/lib/http";
import {
  CreatePatient,
  CreatePatientRes,
  PatientRes,
} from "@/types/patient";

const patientApiRequest = {
  getAllPatient: () =>
    http.get<PatientRes>("patients/relatives", { apiPrefix: "patient" }),
  createPatient: (body: CreatePatient) =>
    http.post<CreatePatientRes>("patients", body, { apiPrefix: "patient" }),
  updatePatient: (id: string | string[], body: CreatePatient) =>
    http.put<CreatePatientRes>(`patients/${id}`, body, {
      apiPrefix: "patient",
    }),
};

export default patientApiRequest;
