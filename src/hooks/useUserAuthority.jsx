import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import NoticeMessage from "../plugin/noticemessage/noticemessage";
import { fetchAuthorityUserAssign, fetchAuthorityUserInfo, fetchUserAuthenticated } from "../api/authority-user";

const useUserAuthority = ({
  id = null,
  queryParams =  "",
  onDeleteSuccess = () => {},
  onCreateSuccess = () => {},
  onUpdateSuccess = () => {},
}) => {
  const queryClient = useQueryClient();

  const { data: userAuthenticated } = useQuery({
    queryKey: ["userAuthenticated", queryParams],
    queryFn: () => fetchUserAuthenticated(queryParams),
    staleTime: 1000 * 60 * 1,
  });

    const { data: authorityUserAssign} = useQuery({
      queryKey: ["authorityUserAssign", id],
      queryFn: () => fetchAuthorityUserAssign(id),
      retry: false, 
      enabled: !!id,
      onError: () => {
      },
    });
    const { data: authorityUserInfo} = useQuery({
      queryKey: ["authorityUserInfo", id],
      queryFn: () => fetchAuthorityUserInfo(id),
      retry: false, 
      enabled: !!id,
      onError: () => {
      },
    });

  return {
    userAuthenticated,
    authorityUserAssign,
    authorityUserInfo
  };
};

export default useUserAuthority;
