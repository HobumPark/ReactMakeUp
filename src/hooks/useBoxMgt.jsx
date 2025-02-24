import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import NoticeMessage from "../plugin/noticemessage/noticemessage.js";
import { createBox, deleteBox, fetchBoxList, fetchDetailBox, updateBox } from "../api/box-mgt.jsx";
import { useTranslation } from "react-i18next";


const useBoxMgt = ({
  rtuID = null,
  queryParams =  "",
  onDeleteSuccess = () => {},
  onCreateSuccess = () => {},
  onUpdateSuccess = () => {},
}) => {
  const queryClient = useQueryClient();
  const {t} = useTranslation();

  const { data: boxListData } = useQuery({
    queryKey: ["boxListData", queryParams],
    queryFn: () => fetchBoxList(queryParams),
    staleTime: 1000 * 60 * 1,
  });

  const { data: detailBoxData} = useQuery({
    queryKey: ["detailBoxData", rtuID],
    queryFn: () => fetchDetailBox(rtuID),
    retry: false, 
    enabled: !!rtuID,
    onError: () => {
    },
  });

  const createBoxMutation = useMutation({
    mutationFn: (boxData) => createBox(boxData),
    onSuccess: (responseData) => {
      new NoticeMessage(t('msg > registration success'), {
        callback() {
          queryClient.invalidateQueries(["boxListData", queryParams]);
          onCreateSuccess(responseData.data);
        }
      });
      },
    onError: (err) => {
      new NoticeMessage(err.message)
      },
  });

  const deleteBoxMutation = useMutation({
    mutationFn: (rtuID) => deleteBox(rtuID),
    onSuccess: () => {
      new NoticeMessage(t('msg > delete success'), {
        callback() {
          onDeleteSuccess();
          queryClient.invalidateQueries(["boxListData", queryParams]);
        }
      });
    },
    onError: (err) => {
      new NoticeMessage(err.message)
      },
    });

  const updateBoxMutation = useMutation({
    mutationFn: (boxData) => updateBox(boxData),
    onSuccess: (responseData) => {
      new NoticeMessage(t('msg > update success'), {
        callback() {
          queryClient.invalidateQueries(["boxListData", queryParams]);
          onUpdateSuccess(responseData.data);
            
        }
      });
    },
    onError: (err) => {
      new NoticeMessage(err.message)
      },
  });

  return {
    boxListData,
    detailBoxData,
    createBox: createBoxMutation.mutate,
    updateBox: updateBoxMutation.mutate,
    deleteBox: deleteBoxMutation.mutate,
  };
};

export default useBoxMgt;
