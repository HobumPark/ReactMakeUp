import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import NoticeMessage from "../plugin/noticemessage/noticemessage";
import { createDetector, deleteDetector, fetchDetailDetector, fetchDetectorList, updateDetector } from "../api/detector-mgt";
import { useTranslation } from "react-i18next";


const useDetectorMgt = ({
  dtID = null,
  queryParams =  "",
  onDeleteSuccess = () => {},
  onCreateSuccess = () => {},
  onUpdateSuccess = () => {},
}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { data: detectorListData } = useQuery({
    queryKey: ["detectorListData", queryParams],
    queryFn: () => fetchDetectorList(queryParams),
    staleTime: 1000 * 60 * 1,
  });

  const { data: detailDetectorData} = useQuery({
    queryKey: ["detailDetectorData", dtID],
    queryFn: () => fetchDetailDetector(dtID),
    retry: false, 
    enabled: !!dtID,
    onError: () => {
    },
  });


  const createDetectorMutation = useMutation({
    mutationFn: (detectorData) => createDetector(detectorData),
    onSuccess: (responseData) => {
      new NoticeMessage(t('msg > registration success'), {
        callback() {
          queryClient.invalidateQueries(["detectorListData", queryParams]);
          onCreateSuccess(responseData.data);
        }
      });
      },
    onError: (err) => {
      new NoticeMessage(err.message)
      },
  });

  const deleteDetectorMutation = useMutation({
    mutationFn: (dtID) => deleteDetector(dtID),
    onSuccess: () => {
      new NoticeMessage(t('msg > delete success'), {
        callback() {
          onDeleteSuccess();
          queryClient.invalidateQueries(["detectorListData", queryParams]);
        }
      });
    },
    onError: (err) => {
      new NoticeMessage(err.message)
      },
    });

  const updateDetectorMutation = useMutation({
    mutationFn: (detectorData) => updateDetector(detectorData),
    onSuccess: (responseData) => {
      new NoticeMessage(t('msg > update success'), {
        callback() {
          queryClient.invalidateQueries(["detectorListData", queryParams]);
          onUpdateSuccess(responseData.data);
            
        }
      });
    },
    onError: (err) => {
      new NoticeMessage(err.message)
      },
  });


  return {
    detectorListData,
    detailDetectorData,
    createDetector: createDetectorMutation.mutate,
    updateDetector: updateDetectorMutation.mutate,
    deleteDetector: deleteDetectorMutation.mutate
  };
};

export default useDetectorMgt;
