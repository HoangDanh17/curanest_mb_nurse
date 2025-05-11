import http from "@/lib/http";
import { NotiListTypeRes, NotiTypeRes } from "@/types/noti";

const notiApiRequest = {
  getNotiList: (id: string) =>
    http.get<NotiListTypeRes>(`notifications?account-id=${id}&page-size=999`, {
      apiPrefix: "notification",
    }),
  updateNoti: (id: string) =>
    http.patch<NotiTypeRes>(`notifications/${id}`, null, {
      apiPrefix: "notification",
    }),
};

export default notiApiRequest;
