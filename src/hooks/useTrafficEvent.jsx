
import { useQuery, useQueryClient } from "@tanstack/react-query";  
import { fetchTrafficEvent, fetchTrafficEventTime } from "../api/dashboard";

const useTrafficEvent = ({
  id ="",
  trafficEventParams = ""
}) => {
  const queryClient = useQueryClient();

   const { data: trafficEventTime  } = useQuery({
     queryKey: ["trafficEventTime", trafficEventParams],
     queryFn: () => fetchTrafficEventTime(trafficEventParams),
    staleTime: 1000 * 60 * 1,
    });

    const { data: trafficEvent } = useQuery({
      queryKey: ["trafficEvent", id],
      queryFn: () => fetchTrafficEvent(id),
      retry: false, 
      enabled: !!id,
      staleTime: 1000 * 60 * 1,
      onError: () => {
      },
    });


  return {
    trafficEventTime,
    trafficEvent,
  };
};

export default useTrafficEvent;