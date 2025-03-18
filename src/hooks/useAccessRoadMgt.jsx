import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchObjectUnqCnt,fetchObjectUnqCntVehicleDirectionTime,fetchObjectUnqCntDirectionTime } from "../api/dashboard";
import { fetchObjectCntMovingDirectionTime, fetchSiteRoadDetector, realTimeObject } from "../api/crossroad.js";

const useAccessRoadMgt = ( {
  siteRoadParams,
  realTimeObjectParams,
  objectUnqCntPie1Params,objectUnqCntPie2Params,
  objectUnqCntTable1TodayParams,objectUnqCntTable1YesterdayParams,objectUnqCntTable1OneWeekParams,
  objectUnqCntTable2TodayParams,objectUnqCntTable2YesterdayParams,objectUnqCntTable2OneWeekParams,
  objectUnqCntVehicleDirectionTimeParams,
  objectUnqCntMovingDirectionParams,
}  ) => {

  //접근로 관련 정보
  const { data: roadData} = useQuery({
    queryKey: ["siteRoadParams", siteRoadParams],
    queryFn: () => fetchSiteRoadDetector(siteRoadParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    enabled: !!siteRoadParams
  });
  //디지털 트윈
  const { data: realTimeObjectData} = useQuery({
    queryKey: ["realTimeObjectParams", realTimeObjectParams],
    queryFn: () => realTimeObject(realTimeObjectParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    refetchInterval: 1000,
    enabled: !!realTimeObjectParams
  });

  //파이차트1
  const { data: objectUnqCntPie1} = useQuery({
    queryKey: ["objectUnqCntPieParams1", objectUnqCntPie1Params],
    queryFn: () => fetchObjectUnqCnt(objectUnqCntPie1Params),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    enabled: !!objectUnqCntPie1Params
  });

  //파이차트2
  const { data: objectUnqCntPie2} = useQuery({
    queryKey: ["objectUnqCntPieParams2", objectUnqCntPie2Params],
    queryFn: () => fetchObjectUnqCnt(objectUnqCntPie2Params),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    enabled: !!objectUnqCntPie2Params
  });

  //테이블1
  const { data: objectUnqCntTable1Today} = useQuery({
    queryKey: ["objectUnqCntTable1TodayParams", objectUnqCntTable1TodayParams],
    queryFn: () => fetchObjectUnqCnt(objectUnqCntTable1TodayParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    enabled: !!objectUnqCntTable1TodayParams
  });
  const { data: objectUnqCntTable1Yesterday} = useQuery({
    queryKey: ["objectUnqCntTable1YesterdayParams", objectUnqCntTable1YesterdayParams],
    queryFn: () => fetchObjectUnqCnt(objectUnqCntTable1YesterdayParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    enabled: !!objectUnqCntTable1YesterdayParams
  });
  const { data: objectUnqCntTable1OneWeek} = useQuery({
    queryKey: ["objectUnqCntTable1OneWeekParams", objectUnqCntTable1OneWeekParams],
    queryFn: () => fetchObjectUnqCnt(objectUnqCntTable1OneWeekParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    enabled: !!objectUnqCntTable1OneWeekParams
  });
  //테이블2
  const { data: objectUnqCntTable2Today} = useQuery({
    queryKey: ["objectUnqCntTable2TodayParams", objectUnqCntTable2TodayParams],
    queryFn: () => fetchObjectUnqCnt(objectUnqCntTable2TodayParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    enabled: !!objectUnqCntTable2TodayParams
  });
  const { data: objectUnqCntTable2Yesterday} = useQuery({
    queryKey: ["objectUnqCntTable1YesterdayParams", objectUnqCntTable2YesterdayParams],
    queryFn: () => fetchObjectUnqCnt(objectUnqCntTable2YesterdayParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    enabled: !!objectUnqCntTable2YesterdayParams
  });
  const { data: objectUnqCntTable2OneWeek} = useQuery({
    queryKey: ["objectUnqCntTable1OneWeekParams", objectUnqCntTable2OneWeekParams],
    queryFn: () => fetchObjectUnqCnt(objectUnqCntTable2OneWeekParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    enabled: !!objectUnqCntTable2OneWeekParams
  });

  //시간별 진입/진출 교통량
  const { data: objectUnqCntMovingDirection} = useQuery({
    queryKey: ["objectUnqCntMovingDirectionParams", objectUnqCntMovingDirectionParams],
    queryFn: () => fetchObjectCntMovingDirectionTime(objectUnqCntMovingDirectionParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    enabled: !!objectUnqCntMovingDirectionParams
  });
  
  //이동류별 차종 교통량
  const { data: objectUnqCntVehicleDirectionTime} = useQuery({
    queryKey: ["objectUnqCntVehicleDirectionTimeParams", objectUnqCntVehicleDirectionTimeParams],
    queryFn: () => fetchObjectUnqCntVehicleDirectionTime(objectUnqCntVehicleDirectionTimeParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    enabled: !!objectUnqCntVehicleDirectionTimeParams
  });

  //시간별 이동류 교통량 그래프
  const { data: objectUnqCntMovingDirectionTime} = useQuery({
    queryKey: ["objectUnqCntMovingDirectionParams", objectUnqCntMovingDirectionParams],
    queryFn: () => fetchObjectUnqCntDirectionTime(objectUnqCntMovingDirectionParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    enabled: !!objectUnqCntMovingDirectionParams
  });
  
  return {
    //접근로 관련 데이터
    roadData,
    //디지털 트윈
    realTimeObjectData,
    //파이차트 1,2
    objectUnqCntPie1,
    objectUnqCntPie2,
    //테이블 1,2
    objectUnqCntTable1Today,
    objectUnqCntTable1Yesterday,
    objectUnqCntTable1OneWeek,
    objectUnqCntTable2Today,
    objectUnqCntTable2Yesterday,
    objectUnqCntTable2OneWeek,
    //시간별 진입/진출 교통량
    objectUnqCntMovingDirection,
    //이동류별 차종 교통량
    objectUnqCntVehicleDirectionTime,
    //시간별 이동류 교통량 그래프
    objectUnqCntMovingDirectionTime
  };
};

export default useAccessRoadMgt;
