import { PUBLIC_API_ENDPOINT } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Alert } from "react-native";

const ENTITY_ERROR_STATUS = 422;
const AUTHENTICATION_ERROR_STATUS = 401;
const FORBIDDEN_ERROR_STATUS = 403;

type EntityErrorPayload = {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
};

export class HttpError extends Error {
  status: number;
  payload: {
    message: string;
    [key: string]: any;
  };
  constructor({ status, payload }: { status: number; payload: any }) {
    super("Http Error");
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  status: 422;
  payload: EntityErrorPayload;
  constructor({
    status,
    payload,
  }: {
    status: 422;
    payload: EntityErrorPayload;
  }) {
    super({ status, payload });
    this.status = status;
    this.payload = payload;
  }
}

type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string;
  apiPrefix?: "auth" | "patient" | string;
};

const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  endpoint: string,
  options?: CustomOptions | undefined
) => {
  const token = await AsyncStorage.getItem("accessToken");
  let body: FormData | string | undefined = undefined;
  if (options?.body instanceof FormData) {
    body = options.body;
  } else if (options?.body) {
    body = JSON.stringify(options.body);
  }
  const baseHeaders: { [key: string]: string } =
    body instanceof FormData
      ? {}
      : {
          "Content-Type": "application/json",
        };
  if (token) {
    baseHeaders["Authorization"] = `Bearer ${token}`;
  }
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const baseUrl =
    options?.baseUrl === undefined ? apiUrl : options.baseUrl;

  const apiPrefix = options?.apiPrefix ? `/${options.apiPrefix}` : "";
  const fullUrl = `${baseUrl}${apiPrefix}/api/v1/${endpoint}`.replace(
    /([^:]\/)\/+/g,
    "$1"
  );
  let payload: Response = {} as Response;

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    } as any,
    body,
    method,
  });

  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError({
        status: 422,
        payload: (await res.json()) as EntityErrorPayload,
      });
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("userInfo");

      Alert.alert(
        "Phiên đăng nhập hết hạn",
        "Vui lòng đăng nhập lại để tiếp tục sử dụng."
      );
      router.replace("/(auth)/login");
      throw new HttpError({
        status: 401,
        payload: await res.json(),
      });
    } else if (res.status === 400) {
      throw new HttpError({
        status: 400,
        payload: await res.json(),
      });
    } else {
      throw new HttpError({
        status: res.status,
        payload: await res.json(),
      });
    }
  } else {
    if (res.status !== 204) {
      payload = await res.json();
    }
  }

  return {
    status: res.status,
    payload,
  };
};

const http = {
  get<Response>(
    endpoint: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("GET", endpoint, options);
  },
  post<Response>(
    endpoint: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("POST", endpoint, { ...options, body });
  },
  put<Response>(
    endpoint: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("PUT", endpoint, { ...options, body });
  },
  delete<Response>(
    endpoint: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("DELETE", endpoint, options);
  },
  patch<Response>(
    endpoint: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("PATCH", endpoint, { ...options, body });
  },
};

export default http;
