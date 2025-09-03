/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation } from "@tanstack/react-query";
import { axiosInstance, baseUrl } from "../api/axios-instance";

// Create Data
export const usePostData = (url: string) => {
  const mutation = useMutation({
    mutationFn: async (arg: any) => {
      const response = await axiosInstance.post(baseUrl + url, arg);
      return response.data;
    },
  });

  return mutation;
};

export const usePostExportData = (url: string) => {
  const mutation = useMutation({
    mutationFn: async (arg: any) => {
      const response = await axiosInstance.post(baseUrl + url, arg, {
        responseType: "blob",
      });
      return response.data;
    },
  });

  return mutation;
};

// Get Export Data
export const useGetExportData = (url: string) => {
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.get(baseUrl + url, {
        responseType: "blob",
      });
      return response.data;
    },
  });

  return mutation;
};

// Upload Data
export const useUploadData = (url: string) => {
  const mutation = useMutation({
    mutationFn: async (arg: any) => {
      const response = await axiosInstance.post(baseUrl + url, arg, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
  });

  return mutation;
};

// Logout
export const useLogout = () => {
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.get(
        baseUrl + "customer/auth/logout"
      );
      return response.data;
    },
  });

  return mutation;
};

// Update (PUT) Data
export const usePutData = (url: string) => {
  const mutation = useMutation({
    mutationFn: async (arg: any) => {
      const response = await axiosInstance.put(baseUrl + url, arg);
      return response.data;
    },
  });

  return mutation;
};

// Delete Data
export const useDeleteData = (url: string) => {
  const mutation = useMutation({
    mutationFn: async (id?: string) => {
      let api_url = `${baseUrl}${url}`;

      if (id) {
        api_url = `${api_url}/${id}`;
      }

      const response = await axiosInstance.delete(api_url);

      return response.data;
    },
  });

  return mutation;
};

// Get Data (Single Fetch)
export const useGetData = (url: string) => {
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.get(baseUrl + url);
      return response.data;
    },
  });

  return mutation;
};

// Fetch Data (GET with Query)
export const useFetchData = (url: string | null) => {
  const query = useQuery({
    queryKey: [url],
    queryFn: async () => {
      const response = await axiosInstance.get(baseUrl + url);
      return response.data;
    },
    enabled: !!url, // only run query if url is truthy
  });

  return { ...query, isLoading: query.isFetching || query.isLoading };
};

// Fetch Post Data (POST with Query)
export const useFetchPostData = (url: string, options: any) => {
  const query = useQuery({
    queryKey: [url, options],
    queryFn: async () => {
      const response = await axiosInstance.post(baseUrl + url, options);
      return response.data;
    },
  });

  return { ...query, isLoading: query.isFetching || query.isLoading };
};
