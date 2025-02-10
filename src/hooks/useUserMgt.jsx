import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, deleteUser, fetchDetailUser, fetchUserList, updateProfile, updateProfilePassword, updateUser } from "../api/user-mgt";
import NoticeMessage from "../plugin/noticemessage/noticemessage";
import { useTranslation } from "react-i18next";

const useUserMgt = ({
  userID = null,
  queryParams =  "",
  onDeleteSuccess = () => {},
  onCreateSuccess = () => {},
  onUpdateSuccess = () => {},
  onResetFail = () => {},
}) => {
  const queryClient = useQueryClient();
  const {t} = useTranslation();
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
    onError: () => {
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userID) => deleteUser(userID),
    onSuccess: () => {
      new NoticeMessage(t('msg > delete success'), {
        callback() {
          onDeleteSuccess();
          queryClient.invalidateQueries(["usersListData", queryParams]);
        }
      });
    },
    onError: (err) => {
      new NoticeMessage(t(err.message))
    },
  });

    // Mutation to create a user (POST request)
    const createUserMutation = useMutation({
      mutationFn: (userData) => createUser(userData),
      onSuccess: (responseData) => {
        new NoticeMessage(t('msg > registration success'), {
          callback() {
            queryClient.invalidateQueries(["usersListData", queryParams]);
            onCreateSuccess(responseData);
          }
        });
      },
      onError: (err) => {
        console.error("Error creating user:", err);
        new NoticeMessage(t(err.message))
      },
    });

    const updateUserMutation = useMutation({
      mutationFn: (userData) => updateUser(userData),
      onSuccess: (responseData) => {
        new NoticeMessage(t('msg > update success'), {
          callback() {
            queryClient.invalidateQueries(["usersListData", queryParams]);
            onUpdateSuccess(responseData);
            
          }
        });
      },
      onError: (err) => {
        console.error("Error updating user:", err);
        new NoticeMessage(t(err.message))
      },
    });

    const updateUserProfileMutation = useMutation({
      mutationFn: (userData) => updateProfile(userData),
      onSuccess: () => {
        new NoticeMessage(t('msg > update success'), {
          callback() {
            queryClient.invalidateQueries(["detailUserData", userID]);
            onUpdateSuccess();
            
          }
        });
      },
      onError: (err) => {
        onResetFail(err);
      },
    });

    const updateUserPasswordMutation = useMutation({
      mutationFn: (userData) => updateProfilePassword(userData),
      onSuccess: () => {
        new NoticeMessage(t('msg > update success'), {
          callback() {
            queryClient.invalidateQueries(["detailUserData", userID]);
            onUpdateSuccess();
            
          }
        });
      },
      onError: (err) => {
        onResetFail(err);
      },
    });



  return {
    usersListData,
    detailUserData,
    deleteUser: deleteUserMutation.mutate,
    createUser: createUserMutation.mutate,
    updateUser: updateUserMutation.mutate,
    updateUserProfile: updateUserProfileMutation.mutate,
    updateProfilePassword: updateUserPasswordMutation.mutate,
    usersListError,
    detailUserError,
    isLoadingUsers,
    isLoadingDetailUser,
  };
};

export default useUserMgt;
