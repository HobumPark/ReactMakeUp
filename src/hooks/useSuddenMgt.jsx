
import { useQuery, useQueryClient } from "@tanstack/react-query";  
import { fetchTrafficEventTime, fetchTrafficEventCnt } from "../api/sudden-mgt";

const useSuddenMgt = ({
  queryParamsTime =  "",
  queryParamsCnt = ""
}) => {
    const queryClient = useQueryClient();

    const { data: trafficEventTime,  } = useQuery({
        queryKey: ["trafficEventTime", queryParamsTime],
        queryFn: () => fetchTrafficEventTime(queryParamsTime),
    staleTime: 1000 * 60 * 1,
    });

    const { data: trafficEventCnt,  } = useQuery({
        queryKey: ["trafficEventCnt", queryParamsCnt],
        queryFn: () => fetchTrafficEventCnt(queryParamsCnt),
    staleTime: 1000 * 60 * 1,
    });


  return {
    trafficEventTime,
    trafficEventCnt
  };
};

export default useSuddenMgt;