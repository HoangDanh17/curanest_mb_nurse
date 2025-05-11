export type NotiListType = {
  id: string;
  "account-id": string;
  content: string;
  route: RelativePathString;
  "created-at": string;
  "read-at": string;
};

export type NotiListTypeRes = {
  status: number;
  data: NotiListType[];
};

export type NotiTypeRes = {
  status: number;
  message: string;
};
