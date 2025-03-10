
import { useQuery, useQueryClient } from "@tanstack/react-query";  
import { fetchObjectCnt, fetchObjectCntAll, fetchObjectCntLane, fetchObjectCntLaneAll, fetchObjectTraffic, fetchObjectTrafficAll } from "../api/statistic";

const UseStatistic = ({
  queryParams =  "",
}) => {
  const queryClient = useQueryClient();

  const { data: objectTrafficList} = useQuery({
    queryKey: ["objectTrafficList", queryParams],
    queryFn: () => fetchObjectTraffic(queryParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  const { data: objectTrafficChartList} = useQuery({
    queryKey: ["objectTrafficChartList", queryParams],
    queryFn: () => fetchObjectTrafficAll(queryParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  const { data: objectCntList } = useQuery({
    queryKey: ["objectCntList", queryParams],
    queryFn: () => fetchObjectCnt(queryParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  const { data: objectCntChartList} = useQuery({
    queryKey: ["objectCntChartList", queryParams],
    queryFn: () => fetchObjectCntAll(queryParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  const { data: objectCntLaneList } = useQuery({
    queryKey: ["objectCntLaneList", queryParams],
    queryFn: () => fetchObjectCntLane(queryParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  const { data: objectCntLaneChartList} = useQuery({
    queryKey: ["objectCntLaneChartList", queryParams],
    queryFn: () => fetchObjectCntLaneAll(queryParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });


  

  return {
    objectTrafficList,
    objectCntList,
    objectCntLaneList,
    objectTrafficChartList,
    objectCntChartList,
    objectCntLaneChartList
  };
};

export default UseStatistic;