import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCodeList } from "../api/code-mgt";

const useCodeMgt = ({
  codeID = null,
  queryParams =  "",
  onDeleteSuccess = () => {},
  onCreateSuccess = () => {},
  onUpdateSuccess = () => {},
}) => {
  const queryClient = useQueryClient();
  // Query to fetch users list
  const { data: codeListData, error: usersListError, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["codeListData", queryParams],
    queryFn: () => fetchCodeList(queryParams),
    staleTime: 1000 * 60 * 1,
  });


  return {
    codeListData,
  };
};

export default useCodeMgt;
