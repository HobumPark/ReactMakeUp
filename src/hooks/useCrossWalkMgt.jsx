import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchObjectUnqCnt, fetchTrafficEventRecent} from "../api/dashboard";
import { fetchObjectCntMovingDirectionTime, fetchSiteRoadDetector, realTimeObject } from "../api/crossroad.js";
import { fetchBoxDetectorFacilityList } from "../api/box-detector-facility.jsx";

const useAccessRoadMgt = ( {
  siteRoadParams,
  realTimeObjectParams,
  objectUnqCntPie1Params,objectUnqCntPie2Params,
  objectUnqCntTable1TodayParams,objectUnqCntTable1YesterdayParams,objectUnqCntTable1OneWeekParams,
  objectUnqCntTable2TodayParams,objectUnqCntTable2YesterdayParams,objectUnqCntTable2OneWeekParams,
  boxDetectorFacilityListParams,
  trafficEventRecentParams,
}  ) => {
    //사이트 관련 정보 - 사이트-횡단보도,교차로
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

  //사이트(횡단보도) 관련 - 함체/검지기/시설물 정보
  const { data: boxDetectorFacilityList} = useQuery({
    queryKey: ["boxDetectorFacilityParams", boxDetectorFacilityListParams],
    queryFn: () => fetchBoxDetectorFacilityList(boxDetectorFacilityListParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    enabled: !!boxDetectorFacilityListParams
  });

  //최근 발생 이벤트 50건
  const { data: trafficEventRecent} = useQuery({
    queryKey: ["trafficEventRecentParams", trafficEventRecentParams],
    queryFn: () => fetchTrafficEventRecent(trafficEventRecentParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    enabled: !!trafficEventRecentParams
  });

  return {
    //횡단보도 관련 데이터
    roadData,
    //리얼타임 데이터
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
     //사이트(횡단보도) 관련 - 함체/검지기/시설물 정보
    boxDetectorFacilityList,
    //
    trafficEventRecent
  };
};

export default useAccessRoadMgt;
