
import { useQuery, useQueryClient } from "@tanstack/react-query";  
import { fetchDeviceStatus, fetchDeviceLogData } from "../api/device-info-mgt";

const useDeviceInfoMgt = ({
  deviceInfoQueryParams,
  deviceLogQueryParams
}) => {
  const queryClient = useQueryClient();

  const { data: deviceInfo} = useQuery({
      queryKey: ["deviceInfoQueryParams",deviceInfoQueryParams],
      queryFn: () => fetchDeviceStatus(),
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
  });

  const { data: deviceLogData} = useQuery({
    queryKey: ["deviceLogQueryParams",deviceLogQueryParams],
    queryFn: () => fetchDeviceLogData(deviceLogQueryParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  return {
    deviceInfo,
    deviceLogData,
  };
};

export default useDeviceInfoMgt;