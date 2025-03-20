import http from "@/lib/http";
import { LoginBodyType, LoginResType } from "@/types/login";

const authApiRequest = {
  login: (body: LoginBodyType) =>
    http.post<LoginResType>("accounts/login", body, { apiPrefix: "auth" }),
};

export default authApiRequest;
