import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, deleteUser, fetchDetailUser, fetchUserList, updateUser } from "../api/user-mgt";
import NoticeMessage from "../plugin/noticemessage/noticemessage";
import { fetchInitialAuthority } from "../api/authority-mgt";
import { fetchProgramAuthenticated } from "../api/authority-program";

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
