
import { useQuery, useQueryClient } from "@tanstack/react-query";  
import { fetchObjectUnqCnt, fetchObjectUnqCntRoad } from "../api/dashboard";
import { fetchObjectCntCompass, fetchObjectCntCompassTime } from "../api/crossroad";

const useObjectCnt = ({
  objectUnqCntRoadParams = "",
  objectUnqCntParams = "",
  objCompassParamsEntry = "",
  objCompassParamsExit = "",
  objCompassTimeParams = "",
}) => {
  const queryClient = useQueryClient();

    const { data: objectUnqCnt} = useQuery({
        queryKey: ["objectUnqCnt", objectUnqCntParams],
        queryFn: () => fetchObjectUnqCnt(objectUnqCntParams),
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
        enabled: !!objectUnqCntParams
    });
      
    const { data: objectUnqCntRoad} = useQuery({
        queryKey: ["objectUnqCntRoad", objectUnqCntRoadParams],
        queryFn: () => fetchObjectUnqCntRoad(objectUnqCntRoadParams),
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
        enabled: !!objectUnqCntRoadParams,
    });

    const { data: objCntCompassEntry} = useQuery({
        queryKey: ["objCntCompassEntry", objCompassParamsEntry],
        queryFn: () => fetchObjectCntCompass(objCompassParamsEntry),
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
        enabled: !!objCompassParamsEntry,
    });

    const { data: objCntCompassExit} = useQuery({
      queryKey: ["objCntCompassExit", objCompassParamsExit],
      queryFn: () => fetchObjectCntCompass(objCompassParamsExit),
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
      enabled: !!objCompassParamsExit,
  });


    const { data: objCntCompassTime} = useQuery({
        queryKey: ["objCntCompassTime", objCompassTimeParams],
        queryFn: () => fetchObjectCntCompassTime(objCompassTimeParams),
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
        enabled: !!objCompassTimeParams,
    });


  return {
    objectUnqCnt,
    objectUnqCntRoad,
    objCntCompassEntry,
    objCntCompassExit,
    objCntCompassTime
  };
};

export default useObjectCnt;