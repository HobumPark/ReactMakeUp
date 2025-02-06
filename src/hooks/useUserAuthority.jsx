import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import NoticeMessage from "../plugin/noticemessage/noticemessage";
import { deleteAuthorityUserInfo, fetchAuthorityUserAssign, fetchAuthorityUserInfo, fetchUserAuthenticated, updateAuthorityUserAssign, updateAuthorityUserInfo } from "../api/authority-user";
import { createAuthority } from "../api/authority-program";
import { createElement } from "react";

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

    const deleteAuthorityUserInfoMutation = useMutation({
      mutationFn: (groupCode) => deleteAuthorityUserInfo(groupCode),
      onSuccess: () => {
        new NoticeMessage(`Delete Success`, {
          callback() {
            onDeleteSuccess();
            queryClient.invalidateQueries(["authorityUserAssign", id]);
            queryClient.invalidateQueries(["authorityUserInfo", id]);
          }
        });
      },
      onError: (err) => {
        console.error("Error deleting user:", err);
      },
    });


    const createAuthorityMutation = useMutation({
      mutationFn: (data) => createAuthority(data),
      onSuccess: (responseData) => {console.log(responseData);
      
        new NoticeMessage(`Data is succesfully registered.`, {
          callback() {
            queryClient.invalidateQueries(["userAuthenticated", queryParams]);
            onCreateSuccess(responseData);
          }
        });
      },
      onError: (err) => {
        console.error("Error creating:", err);
        new NoticeMessage(`${err.message}`)
      },
    });


    const UpdateAuthorityUsersMutation =  useMutation({
      mutationFn: async ({ assignDataAssign, assignDataInfo }) => {
        const requests = [];
      
        if (assignDataAssign && Object.keys(assignDataAssign).length > 0) {
          requests.push(updateAuthorityUserAssign(id, assignDataAssign));
        }
        if (assignDataInfo && Object.keys(assignDataInfo).length > 0) {
          requests.push(updateAuthorityUserInfo(id, assignDataInfo));
        }
      
        if (requests.length === 0) {
          throw new Error("No data");
        }
      
        return await Promise.all(requests);
      },
      
      onSuccess:(responseData) =>{
        new NoticeMessage(`Successfully updated.`, {
          callback() {
            queryClient.invalidateQueries(["initialData", queryParams]);
            onUpdateSuccess(responseData);
          }
        });
      },
      onError:(err) => {
        console.log(err);
      }   
    })


  return {
    userAuthenticated,
    authorityUserAssign,
    authorityUserInfo,
    deleteAuthorityUser:deleteAuthorityUserInfoMutation.mutate,
    UpdateAuthorityUser: UpdateAuthorityUsersMutation.mutate,
    createAuthority: createAuthorityMutation.mutate
  };
};

export default useUserAuthority;
