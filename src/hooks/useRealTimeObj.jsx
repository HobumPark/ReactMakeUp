import { useQueries } from "@tanstack/react-query";
import { realTimeObject } from "../api/crossroad";

const useRealTimeObj = ({ roadIds = [] }) => {
  const refetchInterval = parseInt(5) * 60 * 1000;
  
  const queries = useQueries({
    queries: roadIds.map((roadId) => {
      const queryString = new URLSearchParams({ road_id: roadId }).toString();

      return {
        queryKey: ["realTimeObj", roadId],
        queryFn: () => realTimeObject(queryString),
        cacheTime: 1000 * 60 * 10,
        refetchInterval: refetchInterval, 
        enabled: !!roadId,
      };
    }),
  });

  const queriesWithRoadId = queries.map((query, index) => ({
    ...query.data,
    id: roadIds[index] 
  }));

  return {
    queries: queriesWithRoadId,
  };
};

export default useRealTimeObj;

