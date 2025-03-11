
import { useQuery, useQueryClient } from "@tanstack/react-query";  
import { fetchObjectUnqCnt, fetchObjectUnqCntRoad } from "../api/dashboard";
import { fetchObjectCntCompass, fetchObjectCntCompassTime } from "../api/crossroad";

const useObjectCnt = ({
  objectUnqCntRoadParams = "",
  objectUnqCntParams = "",
  objCompassParams = "",
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

    const { data: objCntCompass} = useQuery({
        queryKey: ["objCntCompass", objCompassParams],
        queryFn: () => fetchObjectCntCompass(objCompassParams),
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
        enabled: !!objCompassParams,
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
    objCntCompass,
    objCntCompassTime
  };
};

export default useObjectCnt;