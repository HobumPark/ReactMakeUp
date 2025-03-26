
import { useQuery, useQueryClient } from "@tanstack/react-query";  
import { fetchMapDisplayPOI, fetchMapInitial } from "../api/dashboard";
import { fetchMapDisplayPOITest, fetchMapDisplayPOIOneTest } from "../api/dashboard";

const useDashboard = ({
  id ="",
  queryParams =  "",
  objectUnqCntRoadParams = "",
  objectUnqCntParams = "",
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

  const { data: mapDisplayPOITest} = useQuery({
    queryKey: ["mapDisplayPOITest"],
    queryFn: () => fetchMapDisplayPOITest(),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  const { data: mapDisplayPOIOneTest} = useQuery({
    queryKey: ["mapDisplayPOIOneTest"],
    queryFn: () => fetchMapDisplayPOIOneTest(),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  return {
    mapInitialView,
    mapDisplayPOI,
    mapDisplayPOITest,
    mapDisplayPOIOneTest
  };
};

export default useDashboard;