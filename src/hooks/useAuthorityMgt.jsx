import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchInitialAuthority } from "../api/authority-mgt";


const useAuthorityMgt = ({
  queryParams =  "",
}) => {
  const queryClient = useQueryClient();

  const { data: initialAuthority } = useQuery({
    queryKey: ["initialData", queryParams],
    queryFn: () => fetchInitialAuthority(queryParams),
    staleTime: 1000 * 60 * 1,
  });


  return {
    initialAuthority,
  };
};

export default useAuthorityMgt;
