/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation } from "@tanstack/react-query";
import { axiosInstance, baseUrl } from "../api/axios-instance";

type RequestHeaders = Record<string, string>;

// -----------------------------
// Merge Headers Helper
// -----------------------------
const normalizeHeaders = (headers: any): Record<string, string> => {
  const normalized: Record<string, string> = {};
  Object.entries(headers || {}).forEach(([key, value]) => {
    if (typeof value === "string") normalized[key] = value;
  });
  return normalized;
};

// Add required Platform: 'web' header to all outgoing requests
const PLATFORM_HEADER: RequestHeaders = { Platform: "web" };

const mergeHeaders = (
  defaultHeaders?: RequestHeaders,
  headers?: RequestHeaders
): RequestHeaders => {
  return {
    ...PLATFORM_HEADER,
    ...normalizeHeaders(axiosInstance.defaults.headers.common),
    ...normalizeHeaders(axiosInstance.defaults.headers.get),
    ...normalizeHeaders(axiosInstance.defaults.headers.post),
    ...normalizeHeaders(axiosInstance.defaults.headers.put),
    ...normalizeHeaders(axiosInstance.defaults.headers.delete),
    ...defaultHeaders,
    ...headers,
  };
};


// -----------------------------
// Create Data (POST)
// -----------------------------
export const usePostData = (url: string, defaultHeaders?: RequestHeaders) => {
  return useMutation({
    mutationFn: async (
      arg:
        | any // raw payload
        | { url?: string; payload?: any; headers?: RequestHeaders } // structured
    ) => {
      let apiUrl = url;
      let payload: any = arg;
      let headers: RequestHeaders | undefined;

      if (typeof arg === "object" && ("url" in arg || "payload" in arg || "headers" in arg)) {
        const structured = arg as { url?: string; payload?: any; headers?: RequestHeaders };
        apiUrl = structured.url ?? url;
        payload = structured.payload ?? {};
        headers = structured.headers;
      }

      const response = await axiosInstance.post(baseUrl + apiUrl, payload, {
        headers: mergeHeaders(defaultHeaders, headers),
      });
      return response.data;
    },
  });
};


// -----------------------------
// Create Export Data (POST Blob)
// -----------------------------
export const usePostExportData = (url: string, defaultHeaders?: RequestHeaders) => {
  return useMutation({
    mutationFn: async (arg: any & { headers?: RequestHeaders }) => {
      const { headers, ...payload } = arg;
      const response = await axiosInstance.post(baseUrl + url, payload, {
        responseType: "blob",
        headers: mergeHeaders(defaultHeaders, headers),
      });
      return response.data;
    },
  });
};

// -----------------------------
// Get Export Data (GET Blob)
// -----------------------------
export const useGetExportData = (url: string, defaultHeaders?: RequestHeaders) => {
  return useMutation({
    mutationFn: async (
      arg:
        | any // raw payload
        | { url?: string; payload?: any; headers?: RequestHeaders } // structured
    ) => {
      let apiUrl = url;
      let headers: RequestHeaders | undefined;

      if (typeof arg === "object" && ("url" in arg || "payload" in arg || "headers" in arg)) {
        const structured = arg as { url?: string; payload?: any; headers?: RequestHeaders };
        apiUrl = structured.url ?? url;
        headers = structured.headers;
      }

      const response = await axiosInstance.get(baseUrl + apiUrl, {
        responseType: "blob",
        headers: mergeHeaders(defaultHeaders, headers),
      });
      return response.data;
    },
  });
};

// -----------------------------
// Upload Data (POST FormData)
// -----------------------------
export const useUploadData = (url: string, defaultHeaders?: RequestHeaders) => {
  return useMutation({
    mutationFn: async (arg: any & { headers?: RequestHeaders }) => {
      const { headers, ...payload } = arg;
      const response = await axiosInstance.post(baseUrl + url, payload, {
        headers: {
          ...mergeHeaders(defaultHeaders, headers),
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
  });
};

// -----------------------------
// Logout (GET)
// -----------------------------
export const useLogout = (defaultHeaders?: RequestHeaders) => {
  return useMutation({
    mutationFn: async (headers?: RequestHeaders) => {
      const response = await axiosInstance.get(baseUrl + "customer/auth/logout", {
        headers: mergeHeaders(defaultHeaders, headers),
      });
      return response.data;
    },
  });
};

// -----------------------------
// Update Data (PUT)
// -----------------------------
export const usePutData = (url: string, defaultHeaders?: RequestHeaders) => {
 return useMutation({
    mutationFn: async (
      arg:
        | any // raw payload
        | { url?: string; payload?: any; headers?: RequestHeaders } // structured
    ) => {
      let apiUrl = url;
      let payload: any = arg;
      let headers: RequestHeaders | undefined;

      if (typeof arg === "object" && ("url" in arg || "payload" in arg || "headers" in arg)) {
        const structured = arg as { url?: string; payload?: any; headers?: RequestHeaders };
        apiUrl = structured.url ?? url;
        payload = structured.payload ?? {};
        headers = structured.headers;
      }

      const response = await axiosInstance.put(baseUrl + apiUrl, payload, {
        headers: mergeHeaders(defaultHeaders, headers),
      });
      return response.data;
    },
  });
};

// -----------------------------
// Delete Data
// -----------------------------
export const useDeleteData = (url: string, defaultHeaders?: RequestHeaders) => {
  return useMutation({
    mutationFn: async (
      arg?: string | { id?: string; headers?: RequestHeaders }
    ) => {
      let apiUrl = `${baseUrl}${url}`;
      let headers: RequestHeaders = {};

      if (typeof arg === "object") {
        if (arg.id) apiUrl = `${apiUrl}/${arg.id}`;
        headers = arg.headers || {};
      } else if (arg) {
        apiUrl = `${apiUrl}/${arg}`;
      }

      const response = await axiosInstance.delete(apiUrl, {
        headers: mergeHeaders(defaultHeaders, headers),
      });

      return response.data;
    },
  });
};

// -----------------------------
// Get Data (Single GET)
// -----------------------------
export const useGetData = (url: string, defaultHeaders?: RequestHeaders) => {
  return useMutation<any, Error, RequestHeaders | void>({
    mutationFn: async (headers) => {
      const response = await axiosInstance.get(baseUrl + url, {
        headers: mergeHeaders(defaultHeaders, headers ?? {}),
      });
      return response.data;
    },
  });
};

// -----------------------------
// Fetch Data (GET with Query)
// -----------------------------
export const useFetchData = (url: string | null, defaultHeaders?: RequestHeaders, enabled = true) => {
  const query = useQuery({
    queryKey: [url],
    queryFn: async () => {
      const response = await axiosInstance.get(baseUrl + url, {
        headers: mergeHeaders(defaultHeaders),
      });
      return response.data;
    },
    enabled: !!url && enabled,
  });

  return { ...query, isLoading: query.isFetching || query.isLoading };
};

// -----------------------------
// Fetch Post Data (POST with Query)
// -----------------------------
export const useFetchPostData = (
  url: string,
  options: any,
  defaultHeaders?: RequestHeaders, 
  enabled = true
) => {
  const query = useQuery({
    queryKey: [url, options],
    queryFn: async () => {
      const response = await axiosInstance.post(baseUrl + url, options, {
        headers: mergeHeaders(defaultHeaders),
      });
      return response.data;
    },
    enabled
  });

  return { ...query, isLoading: query.isFetching || query.isLoading };
};
