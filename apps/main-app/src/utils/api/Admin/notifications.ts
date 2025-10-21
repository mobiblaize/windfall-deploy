import { useGetData } from "../../hooks/useApis";

export const useGetNotifications = (
  params: Record<string, string | number | null>
) => {
  // Filter out null/undefined values and convert numbers to strings
  const queryString = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== null && v !== undefined)
      .reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
  ).toString();

  const url = `admin/notifications${queryString ? `?${queryString}` : ""}`;
  return useGetData(url);
};
