
import { useQuery, useQueryClient } from "@tanstack/react-query";  
import { fetchObjectUnqCnt, fetchObjectUnqCntRoad } from "../api/dashboard";

const useObjectCnt = ({
  objectUnqCntRoadParams = "",
  objectUnqCntParams = "",
}) => {
  const queryClient = useQueryClient();

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

    objectUnqCnt,
    objectUnqCntRoad
  };
};

export default useObjectCnt;