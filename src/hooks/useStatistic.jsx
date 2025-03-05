
import { useQuery, useQueryClient } from "@tanstack/react-query";  
import { fetchObject, fetchObjectChart, fetchObjectCnt, fetchObjectCntLane, fetchObjectTraffic } from "../api/statistic";

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
    queryFn: () => fetchObjectChart(queryParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  const { data: objectCntList } = useQuery({
    queryKey: ["objectCntList", queryParams],
    queryFn: () => fetchObjectCnt(queryParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  const { data: objectCntLaneList } = useQuery({
    queryKey: ["objectCntLaneList", queryParams],
    queryFn: () => fetchObjectCntLane(queryParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });
  

  return {
    objectTrafficList,
    objectCntList,
    objectCntLaneList,
    objectTrafficChartList
  };
};

export default UseStatistic;