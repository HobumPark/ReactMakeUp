import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createLowerCode, createUpperCode, deleteCode, fetchCodeList, fetchDetailCode, updateLowerCode, updateUpperCode } from "../api/code-mgt";
import NoticeMessage from "../plugin/noticemessage/noticemessage";

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
  const { data: codeListSelect } = useQuery({
    queryKey: ["codeListData", 'deletion=001002'],
    queryFn: () => fetchCodeList('deletion=001002'),
    staleTime: 1000 * 60 * 1,
  });

  const { data: detailCodeData, error: detailCodeError, isLoading: isLoadingDetailCode} = useQuery({
    queryKey: ["detailUserData", codeID],
    queryFn: () => fetchDetailCode(codeID),
    retry: false, 
    enabled: !!codeID,
    onError: () => {},
  });

  const createUpperCodeMutation = useMutation({
      mutationFn: (codeData) => createUpperCode(codeData),
      onSuccess: (responseData) => {
        new NoticeMessage(`Data is succesfully registered.`, {
          callback() {
            queryClient.invalidateQueries(["codeListData", queryParams]);
            onCreateSuccess(responseData);
          }
        });
      },
      onError: (err) => {
        console.error("Error creating user:", err);
        new NoticeMessage(`${err.message}`)
      },
  }); 

  const createLowerCodeMutation = useMutation({
        mutationFn: (codeData) => createLowerCode(codeData),
        onSuccess: (responseData) => {
          new NoticeMessage(`Data is succesfully registered.`, {
            callback() {
              queryClient.invalidateQueries(["codeListData", queryParams]);
              onCreateSuccess(responseData);
            }
          });
        },
        onError: (err) => {
          console.error("Error creating user:", err);
          new NoticeMessage(`${err.message}`)
        },
    });  

    const updateUpperCodeMutation = useMutation({
      mutationFn: (codeData) => updateUpperCode(codeData),
      onSuccess: (responseData) => {
        new NoticeMessage(`Successfully updated.`, {
          callback() {
            queryClient.invalidateQueries(["codeListData", queryParams]);
            onUpdateSuccess(responseData);
          }
        });
      },
      onError: (err) => {
        console.error("Error updating code:", err);
      },
    });

    const updateLowerCodeMutation = useMutation({
      mutationFn: (codeData) => updateLowerCode(codeData),
      onSuccess: () => {
        new NoticeMessage(`Successfully updated.`, {
          callback() {
            queryClient.invalidateQueries(["codeListData", queryParams]);
            onUpdateSuccess();
          }
        });
      },
      onError: (err) => {
        console.error("Error updating code:", err);
      },
    });

  const deleteCodeMutation = useMutation({
    mutationFn: (codeID) => deleteCode(codeID),
    onSuccess: () => {
      new NoticeMessage(`Delete Success`, {
        callback() {
          onDeleteSuccess();
          queryClient.invalidateQueries(["codeListData", queryParams]);
        }
      });
    },
    onError: (err) => {
      console.error("Error deleting user:", err);
    },
  });

  return {
    codeListData,
    codeListSelect,
    detailCodeData,
    detailCodeError,
    createUpperCode: createUpperCodeMutation.mutate,
    createLowerCode: createLowerCodeMutation.mutate,
    updateUpperCode: updateUpperCodeMutation.mutate,
    updateLowerCode: updateLowerCodeMutation.mutate,
    deleteCode: deleteCodeMutation.mutate,
  };
};

export default useCodeMgt;
