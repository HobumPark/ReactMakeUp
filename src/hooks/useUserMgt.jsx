import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, deleteUser, fetchDetailUser, fetchUserList, updateUser } from "../api/user-mgt";
import NoticeMessage from "../plugin/noticemessage/noticemessage";

const useUserMgt = ({
  userID = null,
  queryParams =  "",
  onDeleteSuccess = () => {},
  onCreateSuccess = () => {},
  onUpdateSuccess = () => {},
}) => {
  const queryClient = useQueryClient();
  // Query to fetch users list
  const { data: usersListData, error: usersListError, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["usersListData", queryParams],
    queryFn: () => fetchUserList(queryParams),
    staleTime: 1000 * 60 * 1,
  });

  // Query to fetch detailed user data
  const { data: detailUserData, error: detailUserError, isLoading: isLoadingDetailUser} = useQuery({
    queryKey: ["detailUserData", userID],
    queryFn: () => fetchDetailUser(userID),
    retry: false, 
    enabled: !!userID,
    onError: (err) => {
      alert(err)
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userID) => deleteUser(userID),
    onSuccess: () => {
      new NoticeMessage(`Delete Success`, {
        callback() {
          onDeleteSuccess();
          queryClient.invalidateQueries(["usersListData", queryParams]);
        }
      });
    },
    onError: (err) => {
      console.error("Error deleting user:", err);
    },
  });

    // Mutation to create a user (POST request)
    const createUserMutation = useMutation({
      mutationFn: (userData) => createUser(userData),
      onSuccess: (responseData) => {
        new NoticeMessage(`Data is succesfully registered.`, {
          callback() {
            queryClient.invalidateQueries(["usersListData", queryParams]);
            onCreateSuccess(responseData);
          }
        });
      },
      onError: (err) => {
        console.error("Error creating user:", err);
        new NoticeMessage(`${err.message}`)
      },
    });

    const updateUserMutation = useMutation({
      mutationFn: (userData) => updateUser(userData),
      onSuccess: () => {
        new NoticeMessage(`:: msg > update success`, {
          callback() {
            queryClient.invalidateQueries(["usersListData", queryParams]);
            onUpdateSuccess();
            
          }
        });
      },
      onError: (err) => {
        console.error("Error updating user:", err);
      },
    });


  return {
    usersListData,
    detailUserData,
    deleteUser: deleteUserMutation.mutate,
    createUser: createUserMutation.mutate,
    updateUser: updateUserMutation.mutate,
    usersListError,
    detailUserError,
    isLoadingUsers,
    isLoadingDetailUser,
  };
};

export default useUserMgt;
