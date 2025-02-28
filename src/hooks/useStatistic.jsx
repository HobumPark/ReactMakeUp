
import { useQuery, useQueryClient } from "@tanstack/react-query";  
import { fetchObject } from "../api/statistic";

const UseStatistic = ({
  queryParams =  "",
}) => {
  const queryClient = useQueryClient();

  const { data: objectListData } = useQuery({
    queryKey: ["objectListData", queryParams],
    queryFn: () => fetchObject(queryParams),
    staleTime: 1000 * 60 * 1,
  });


  return {
    objectListData,
  };
};

export default UseStatistic;