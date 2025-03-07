
import { useQuery, useQueryClient } from "@tanstack/react-query";  
import { fetchObjectCnt, fetchObjectCntAll, fetchObjectCntLane, fetchObjectCntLaneAll, fetchObjectTraffic, fetchObjectTrafficAll } from "../api/statistic";
import { fetchMapDisplayPOI, fetchMapInitial, fetchObjectUnqCnt, fetchObjectUnqCntRoad, fetchSiteRoad, fetchTrafficEvent, fetchTrafficEventTime } from "../api/dashboard";

const useDashboard = ({
  id ="",
  queryParams =  "",
  objectUnqCntRoadParams = "",
  objectUnqCntParams = ""
}) => {
  const queryClient = useQueryClient();

  const { data: mapInitialView} = useQuery({
    queryKey: ["mapInitialView"],
    queryFn: () => fetchMapInitial(),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  const { data: mapDisplayPOI} = useQuery({
    queryKey: ["mapDisplayPOI"],
    queryFn: () => fetchMapDisplayPOI(),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

   const { data: siteRoad  } = useQuery({
    queryKey: ["siteRoad", queryParams],
    queryFn: () => fetchSiteRoad(queryParams),
    staleTime: 1000 * 60 * 1,
 });

    const { data: trafficEventTime,  } = useQuery({
     queryKey: ["trafficEventTime", queryParams],
     queryFn: () => fetchTrafficEventTime(queryParams),
    staleTime: 1000 * 60 * 1,
    });

  
    const { data: trafficEvent, } = useQuery({
      queryKey: ["trafficEvent", id],
      queryFn: () => fetchTrafficEvent(id),
      retry: false, 
      enabled: !!id,
      onError: () => {
      },
    });

    const { data: objectUnqCnt} = useQuery({
        queryKey: ["objectUnqCnt", objectUnqCntParams],
        queryFn: () => fetchObjectUnqCnt(objectUnqCntParams),
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
    });
      
    const { data: objectUnqCntRoad} = useQuery({
        queryKey: ["objectUnqCntRoad", objectUnqCntRoadParams],
        queryFn: () => fetchObjectUnqCntRoad(objectUnqCntRoadParams),
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
    });



  

  return {
    mapInitialView,
    mapDisplayPOI,
    siteRoad,
    trafficEventTime,
    trafficEvent,
    objectUnqCnt,
    objectUnqCntRoad
  };
};

export default useDashboard;