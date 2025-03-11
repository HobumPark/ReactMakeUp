
import { useQuery, useQueryClient } from "@tanstack/react-query";  
import { fetchObject } from "../api/statistic";

const useHistory = ({
  queryParams =  "",
}) => {
  const queryClient = useQueryClient();

  const { data: objectListData } = useQuery({
    queryKey: ["objectListData", queryParams],
    queryFn: () => fetchObject(queryParams),
    staleTime: 1000 * 60 * 1,
    keepPreviousData: true,
  });

  return {
    objectListData,
  };
};

export default useHistory;