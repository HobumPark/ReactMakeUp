import { useQueries } from "@tanstack/react-query";
import { realTimeObject } from "../api/crossroad";

const useRealTimeObj = ({ roadIds = [] }) => {
  const refetchInterval = 5 * 60 * 1000; // 5 minutes

  const queries = useQueries({
    queries: roadIds.map((roadId) => {
      const queryString = new URLSearchParams({ road_id: roadId }).toString();

      return {
        queryKey: ["realTimeObj", roadId],
        queryFn: () => realTimeObject(queryString),
        cacheTime: 1000 * 60 * 10, // Cache for 10 minutes
        refetchInterval: refetchInterval, 
        enabled: !!roadId,  // Only enable query if roadId is valid
        keepPreviousData: true,  // Keep old data while loading new data
        staleTime: 1000 * 60 * 5,  // Data is fresh for 5 minutes
        select: (data) => ({
          ...data,
          road_id: roadId, // Add road_id directly to the response data
        }),
      };
    }),
  });

  // Return queries directly, as the road_id is now included in the response data
  return {
    queries,
  };
};

export default useRealTimeObj;
