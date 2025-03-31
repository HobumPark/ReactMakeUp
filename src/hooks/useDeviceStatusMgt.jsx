
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchDeviceStatus, fetchTraceData,fetchHeartBeat } from "../api/device-info-mgt";

const useDeviceStatusMgt = ({
  deviceInfoQueryParams,
  traceQueryParams,
  heartBeatQueryParams,
}) => {
  const queryClient = useQueryClient();

  //디바이스 목록 및 상태 조회
  const { data: deviceStatus} = useQuery({
      queryKey: ["deviceInfoQueryParams",deviceInfoQueryParams],
      queryFn: () => fetchDeviceStatus(),
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
  });

  //차량 이동경로 조회
  const { data: trace} = useQuery({
    queryKey: ["traceQueryParams",traceQueryParams],
    queryFn: () => fetchTraceData(),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  //하트비트 수집
  const { data: heartBeat} = useQuery({
    queryKey: ["heartBeatQueryParams",heartBeatQueryParams],
    queryFn: () => fetchHeartBeat(),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });


  //하트비트 수집 에러 체크

  //데이터 저장

  return {
    deviceStatus,
    trace,
    heartBeat,
  };
};

export default useDeviceStatusMgt;