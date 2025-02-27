import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchRoadList, deleteRoad, createRoad, updateRoad } from "../api/road-mgt";
import { useTranslation } from "react-i18next";
import NoticeMessage from "../plugin/noticemessage/noticemessage";

const useRoadMgt = ({
  queryParams = "",
  onUpdateSuccess = () => {},
  onDeleteSuccess = () => {},
  onCreateSuccess = () => {}
}) => {
  const queryClient = useQueryClient();
  const {t} = useTranslation();

  // Query to fetch road list
  const { data: roadListData, error: roadListError, isLoading: isLoadingRoad } = useQuery({
    queryKey: ["roadListData", queryParams],
    queryFn: () => fetchRoadList(queryParams),
    staleTime:0,
    enabled: queryParams !== null,  // queryParams가 없으면 요청이 활성화되지 않음
  });

  // 콘솔에 출력 (useEffect로 감싸지 않고 바로 출력)
  if (roadListData) {
    console.log('도로 목록 데이터:', roadListData);
  }

  // delete road
  const deleteRoadMutation = useMutation({
      mutationFn: (roadId) => deleteRoad(roadId),
      onSuccess: () => {
        //alert('사이트 삭제 노티스 전 확인')
        new NoticeMessage(t('msg > delete success'), {
          callback() {
            onDeleteSuccess();
            queryClient.invalidateQueries(["roadListData", queryParams]);
          }
        });
      },
      onError: (err) => {
        //console.log(err)
        new NoticeMessage(t(err.message))
      },
    });

  // create road
  // Mutation to create a road (POST request)
  const createRoadMutation = useMutation({
    mutationFn: (roadData) => createRoad(roadData),
    onSuccess: (responseData) => {
      new NoticeMessage(t('msg > registration success'), {
        callback() {
          queryClient.invalidateQueries(["roadListData", queryParams]);
          onCreateSuccess(responseData);
        }
      });
    },
    onError: (err) => {
      //console.error("Error creating Road:", err);
      new NoticeMessage(t(err.message))
    },
  });

  // update road
  // Mutation to update a rad (PUT request)
  const updateRoadMutation = useMutation({
        mutationFn: (roadData) => updateRoad(roadData.site_id, roadData),
        onSuccess: (responseData) => {
          new NoticeMessage(t('msg > update success'), {
            callback() {
              queryClient.invalidateQueries(["roadListData", queryParams]);
              onUpdateSuccess(responseData);
              
            }
          });
        },
        onError: (err) => {
          console.error("Error updating road:", err);
          new NoticeMessage(t(err.message))
        },
  });

  return {
    roadListData,
    isLoadingRoad,
    createRoad: createRoadMutation.mutate,
    deleteRoad: deleteRoadMutation.mutate,
    updateRoad: updateRoadMutation.mutate
  };
};

export default useRoadMgt;
