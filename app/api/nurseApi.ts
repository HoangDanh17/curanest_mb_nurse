import http from "@/lib/http";
import {
  DetailNurseRes,
  FeedbackTypeOneRes,
  FeedbackTypeRes,
  ListNurseDataRes,
  NurseDataRes,
} from "@/types/nurse";

const nurseApiRequest = {
  nurseProfile: () =>
    http.get<NurseDataRes>("nurses/me", { apiPrefix: "nurse" }),
  getListNurse: (
    id?: string | string[],
    page?: number,
    nurseName?: string | null
  ) =>
    http.get<ListNurseDataRes>(
      `nurses?service-id=${id}${
        nurseName ? `&nurse-name=${nurseName}` : ""
      }&page=${page}&size=50`,
      { apiPrefix: "nurse" }
    ),
  getListNurseAll: () =>
    http.get<ListNurseDataRes>(`nurses?page=${1}&size=50`, {
      apiPrefix: "nurse",
    }),
  getDetailNurse: (id: string | string[]) =>
    http.get<DetailNurseRes>(`nurses/${id}`, { apiPrefix: "nurse" }),
  getFeedbackList: (id: string) =>
    http.get<FeedbackTypeRes>(`feedbacks/nursing/${id}`, {
      apiPrefix: "nurse",
    }),
  getFeedback: (id: string) =>
    http.get<FeedbackTypeOneRes>(`feedbacks/${id}`, {
      apiPrefix: "nurse",
    }),
};

export default nurseApiRequest;
