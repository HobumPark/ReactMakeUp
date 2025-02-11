import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import NoticeMessage from "../plugin/noticemessage/noticemessage";
import { createLowerProgram, createUpperProgram, deleteProgram, fetchDetailProgram, fetchProgramList, updateLowerProgram, updateUpperProgram } from "../api/program-mgt";
import { useTranslation } from "react-i18next";

const useProgramMgt = ({
  programID = null,
  queryParams =  "",
  onDeleteSuccess = () => {},
  onCreateSuccess = () => {},
  onUpdateSuccess = () => {},
}) => {
  const queryClient = useQueryClient();
  const {t} = useTranslation();

  const { data: programListData,  } = useQuery({
    queryKey: ["programListData", queryParams],
    queryFn: () => fetchProgramList(queryParams),
    staleTime: 1000 * 60 * 1,
  });

  const { data: programListSelect } = useQuery({
    queryKey: ["programListSelect", 'deletion=001002'],
    queryFn: () => fetchProgramList('deletion=001002'),
    staleTime: 1000 * 60 * 1,
  });

  const { data: detailProgramData, error: detailProgramError, isLoading: isLoadingProgramprogram} = useQuery({
    queryKey: ["detailProgramData", programID],
    queryFn: () => fetchDetailProgram(programID),
    retry: false, 
    enabled: !!programID,
    onError: () => {},
  });

  const createUpperProgramMutation = useMutation({
      mutationFn: (programData) => createUpperProgram(programData),
      onSuccess: (responseData) => {
        new NoticeMessage(t('msg > registration success'), {
          callback() {
            queryClient.invalidateQueries(["programListData", queryParams]);
            onCreateSuccess(responseData);
          }
        });
      },
      onError: (err) => {
        console.error("Error creating:", err);
        new NoticeMessage(t(err.message))
      },
  }); 

  const createLowerProgramMutation = useMutation({
        mutationFn: (programData) => createLowerProgram(programData),
        onSuccess: (responseData) => {
          new NoticeMessage(t('msg > registration success'), {
            callback() {
              queryClient.invalidateQueries(["programListData", queryParams]);
              onCreateSuccess(responseData);
            }
          });
        },
        onError: (err) => {
          console.error("Error creating user:", err);
          new NoticeMessage(t(err.message))
        },
    });  

    const updateUpperProgramMutation = useMutation({
      mutationFn: (programData) => updateUpperProgram(programData),
      onSuccess: (responseData) => {
        new NoticeMessage(t('msg > update success'), {
          callback() {
            queryClient.invalidateQueries(["programListData", queryParams]);
            onUpdateSuccess(responseData);
          }
        });
      },
      onError: (err) => {
        console.error("Error updating program:", err);
        new NoticeMessage(t(err.message))
      },
    });

    const updateLowerProgramMutation = useMutation({
      mutationFn: (programData) => updateLowerProgram(programData),
      onSuccess: () => {
        new NoticeMessage(t('msg > update success'), {
          callback() {
            queryClient.invalidateQueries(["programListData", queryParams]);
            onUpdateSuccess();
          }
        });
      },
      onError: (err) => {
        console.error("Error updating program:", err);
        new NoticeMessage(t(err.message))
      },
    });

  const deleteProgramMutation = useMutation({
    mutationFn: (programID) => deleteProgram(programID),
    onSuccess: () => {
      new NoticeMessage(t('msg > delete success'), {
        callback() {
          onDeleteSuccess();
          queryClient.invalidateQueries(["programListData", queryParams]);
        }
      });
    },
    onError: (err) => {
      console.error("Error deleting user:", err);
      new NoticeMessage(t(err.message))
    },
  });

  return {
    programListData,
    programListSelect,
    detailProgramData,
    detailProgramError,
    createUpperProgram: createUpperProgramMutation.mutate,
    createLowerProgram: createLowerProgramMutation.mutate,
    updateUpperProgram: updateUpperProgramMutation.mutate,
    updateLowerProgram: updateLowerProgramMutation.mutate,
    deleteProgram: deleteProgramMutation.mutate,
  };
};

export default useProgramMgt;
