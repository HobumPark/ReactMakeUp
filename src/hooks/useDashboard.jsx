
import { useQuery, useQueryClient } from "@tanstack/react-query";  
import { fetchMapDisplayPOI, fetchMapInitial, fetchObjectUnqCnt, fetchObjectUnqCntRoad, fetchSiteRoad, fetchTrafficEvent, fetchTrafficEventTime } from "../api/dashboard";

const useDashboard = ({
  id ="",
  queryParams =  "",
  objectUnqCntRoadParams = "",
  objectUnqCntParams = "",
  siteRoadParams = "",
  trafficEventParams = ""
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
    queryKey: ["siteRoad", siteRoadParams],
    queryFn: () => fetchSiteRoad(siteRoadParams),
    staleTime: 1000 * 60 * 1,
 });



  return {
    mapInitialView,
    mapDisplayPOI,
    siteRoad
  };
};

export default useDashboard;