import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSiteList, fetchDetailSite, deleteSite, updateSite, createSite } from "../api/site-mgt";
import { updateRoad, createRoad, deleteRoad } from "../api/road-mgt";

import NoticeMessage from "../plugin/noticemessage/noticemessage";
import { useTranslation } from "react-i18next";

const useSiteMgt = ({
  queryParams =  "",
  siteId= null,
  onUpdateSuccess = () => {},
  onDeleteSuccess = () => {},
  onCreateSuccess = () => {}
}) => {
  const queryClient = useQueryClient();
  const {t} = useTranslation();
  // Query to fetch site list
  const { data: siteListData, error: siteListError, isLoading: isLoadingSites } = useQuery({
    queryKey: ["siteListData", queryParams],
    queryFn: () => fetchSiteList(queryParams),
    staleTime: 1000 * 60 * 1,
  });

  // Query to fetch detailed user data
    const { data: detailSiteData, error: detailSiteError, isLoading: isLoadingDetailSite} = useQuery({
      queryKey: ["detailSiteData", siteId],
      queryFn: () => fetchDetailSite(siteId),
      retry: false, 
      enabled: !!siteId,
      onError: () => {
      },
    });
  

  // Update Site
  const updateSiteMutation = useMutation({
        mutationFn: (siteData) => updateSite(siteData),
        onSuccess: (responseData) => {
          //alert('updateSiteMutation onSuccess!')
          new NoticeMessage(t('정상적으로 정보가 입력되었습니다.'), {
            callback() {
              queryClient.invalidateQueries(["siteListData", queryParams]);
              onUpdateSuccess(responseData);
              
            }
          });
        },
        onError: (err) => {
          console.error("Error updating site:", err);
          new NoticeMessage(t(err.message))
        },
  });

  //Update Site + Road
  const updateSiteRoadMutation =  useMutation({
        mutationFn: async ({ siteInfo, roadInputList }) => {
          const requests = [];
          console.log('updateSiteRoadMutation')
          console.log(siteInfo)
          console.log(roadInputList)

          if (siteInfo && Object.keys(siteInfo).length > 0) {
          requests.push(updateSite(siteInfo))
          }

          if (roadInputList && Object.keys(roadInputList).length > 0) {
          // 반복문을 통해 roadInputList의 각 항목에 대해 요청을 추가
            for (let i = 0; i < roadInputList.length; i++) {
              const roadInfo = roadInputList[i];
              console.log('roadInfo.is_new')
              console.log(roadInfo.is_new)
              
              //기존껀 update요청, 새로운정보는 create요청
              if(roadInfo.is_new==true){// new road info - create
                requests.push(createRoad(roadInfo));
              }else if(roadInfo.is_new==false){ // exist road info - update
                 // 각 roadInfo에 대해 updateSite 요청을 추가
                 requests.push(updateRoad(roadInfo.site_id,roadInfo));
              }
            }

          }
          return await Promise.all(requests);
        },
        
        onSuccess:(responseData) =>{
          new NoticeMessage(t('정상적으로 정보가 입력되었습니다.'), {
            callback() {
              queryClient.invalidateQueries(["siteListData", queryParams]);
              onUpdateSuccess(responseData);
            }
          });
        },
        onError:(err) => {
          new NoticeMessage(t(err.message))
        }   
      })

  // Delete Site
  const deleteSiteMutation = useMutation({
      mutationFn: (siteId) => deleteSite(siteId),
      onSuccess: () => {
        new NoticeMessage(t('정상적으로 삭제되었습니다.'), {
          callback() {
            onDeleteSuccess();
            queryClient.invalidateQueries(["siteListData", queryParams]);
          }
        });
      },
      onError: (err) => {
        new NoticeMessage(t(err.message))
      },
    });

  // Mutation to create a Site (POST request)
  const createSiteMutation = useMutation({
    mutationFn: async (siteData) => { // async 키워드를 추가하여 비동기 처리
      console.log('createSiteMutation:'); // siteData 콘솔로 출력
      console.log('siteData:', siteData); // siteData 콘솔로 출력
  
      try {
        // 비동기 API 호출 후 결과를 기다림
        const createSiteResult = await createSite(siteData); // 실제 API 호출
        console.log('createSiteResult:', createSiteResult); // API 응답 출력
  
        return createSiteResult; // API 결과 반환
      } catch (error) {
        console.error('Error during createSite:', error);
        throw error; // 오류 발생 시 throw
      }
    },
    onSuccess: (responseData) => {
      new NoticeMessage(t('정상적으로 정보가 입력되었습니다.'), {
        callback() {
          queryClient.invalidateQueries(["siteListData", queryParams]);
          onCreateSuccess(responseData);
        }
      });
      console.log('createSiteMutation on Success');
      console.log(responseData);
      return responseData
    },
    onError: (err) => {
      console.error("Error creating site:", err);
      // new NoticeMessage(t(err.message))
    },
  });
  
  const createSiteRoadMutation =  useMutation({
    mutationFn: async ({ siteInfo, roadInputList }) => {
      const requests = [];
      console.log('createSiteRoadMutation')
      
      console.log(siteInfo)
      console.log(roadInputList)

        if (siteInfo && Object.keys(siteInfo).length > 0) {
            requests.push(createSite(siteInfo))
        }

        if (roadInputList && Object.keys(roadInputList).length > 0) {
        // 반복문을 통해 roadInputList의 각 항목에 대해 요청을 추가
          for (let i = 0; i < roadInputList.length; i++) {
            const roadInfo = roadInputList[i];
            // 각 roadInfo에 대해 updateSite 요청을 추가
            requests.push(createRoad(roadInfo));
          }
        }
        return await Promise.all(requests);
    },
    
    onSuccess:(responseData) =>{
      new NoticeMessage(t('정상적으로 정보가 입력되었습니다.'), {
        callback() {
          queryClient.invalidateQueries(["siteListData", queryParams]);
          onUpdateSuccess(responseData);
        }
      });
    },
    onError:(err) => {
      new NoticeMessage(t(err.message))
    }   
  })


  const deleteSiteRoadMutation =  useMutation({
    mutationFn: async ({ siteId, roadIdList }) => {
      const requests = [];
      console.log('deleteSiteRoadMutation')
      
      console.log(siteId)
      console.log(roadIdList)

        if (siteId) {
            requests.push(deleteSite(siteId))
        }

        if (roadIdList && Object.keys(roadIdList).length > 0) {
        // 반복문을 통해 roadInputList의 각 항목에 대해 요청을 추가
          for (let i = 0; i < roadIdList.length; i++) {
            const roadId = roadIdList[i];
            // 각 roadInfo에 대해 updateSite 요청을 추가
            requests.push(deleteRoad(roadId));
          }
        }
        return await Promise.all(requests);
    },
    
    onSuccess:(responseData) =>{
      new NoticeMessage(t('정상적으로 삭제되었습니다.'), {
        callback() {
          queryClient.invalidateQueries(["siteListData", queryParams]);
          onDeleteSuccess(responseData);
        }
      });
    },
    onError:(err) => {
      new NoticeMessage(t(err.message))
    }   
  })


  return {
    siteListData,
    detailSiteData,
    deleteSite: deleteSiteMutation.mutate,
    updateSite: updateSiteMutation.mutate,
    createSite: createSiteMutation.mutate,
    createSiteRoad: createSiteRoadMutation.mutate,
    updateSiteRoad: updateSiteRoadMutation.mutate,
    deleteSiteRoad: deleteSiteRoadMutation.mutate
  };
};

export default useSiteMgt;
