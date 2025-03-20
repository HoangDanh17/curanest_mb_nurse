import http from "@/lib/http";
import { NurseDataRes } from "@/types/nurse";

const nurseApiRequest = {
  nurseProfile: () => http.get<NurseDataRes>("nurses/me", { apiPrefix: "nurse" }),
};

export default nurseApiRequest;
