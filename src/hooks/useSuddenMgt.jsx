
import { useQuery, useQueryClient } from "@tanstack/react-query";  
import { fetchTrafficEventTime, fetchTrafficEventCnt } from "../api/sudden-mgt";

const useSuddenMgt = ({
  queryParams =  "",
}) => {
    const queryClient = useQueryClient();

    const { data: trafficEventTime,  } = useQuery({
        queryKey: ["trafficEventTime", queryParams],
        queryFn: () => fetchTrafficEventTime(queryParams),
    staleTime: 1000 * 60 * 1,
    });

    const { data: trafficEventCnt,  } = useQuery({
        queryKey: ["trafficEventCnt", queryParams],
        queryFn: () => fetchTrafficEventCnt(queryParams),
    staleTime: 1000 * 60 * 1,
    });


  return {
    trafficEventTime,
    trafficEventCnt
  };
};

export default useSuddenMgt;