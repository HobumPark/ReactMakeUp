import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchDeviceStatus, fetchTraceData, fetchHeartBeat } from "../api/device-info-mgt";

const useDeviceStatusMgt = ({
  deviceInfoQueryParams,
  traceQueryParams,
  //heartBeatQueryParams,
}) => {
  const queryClient = useQueryClient();

  // 디바이스 목록 및 상태 조회
  const { data: deviceStatus } = useQuery({
    queryKey: ["deviceInfoQueryParams", deviceInfoQueryParams],
    queryFn: () => fetchDeviceStatus(),
    staleTime: 1000 * 60 * 5, // 데이터의 신선도 유지 시간 (5분)
    cacheTime: 1000 * 60 * 10, // 캐시된 데이터를 유지할 시간 (10분)
    refetchInterval: 2000, // ~초마다 자동 갱신
    onSuccess: (data) => {
      console.log("Device Status Data Refetched:", data); // 데이터가 갱신될 때마다 콘솔에 출력
    },
  });

  // 차량 이동경로 조회
  const { data: trace } = useQuery({
    queryKey: ["traceQueryParams", traceQueryParams],
    queryFn: () => fetchTraceData(),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    refetchInterval: 2000, // ~초마다 자동 갱신
    onSuccess: (data) => {
      console.log("Trace Data Refetched:", data); // 데이터가 갱신될 때마다 콘솔에 출력
    },
  });

 
  return {
    deviceStatus,
    trace,
  };
};

export default useDeviceStatusMgt;
