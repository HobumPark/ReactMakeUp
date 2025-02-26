import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSiteList, fetchDetailSite, deleteSite, updateSite, createSite } from "../api/site-mgt";
import NoticeMessage from "../plugin/noticemessage/noticemessage";
import { useTranslation } from "react-i18next";

const useSiteMgt = ({
  queryParams =  "",
  siteId= ""
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
        mutationFn: (siteData) => {
          console.log('mutationFn:', siteData);  // 여기서 값을 확인
          return updateSite(siteData);
        },
        onSuccess: (responseData) => {
          alert('onSuccess!')
          new NoticeMessage(t('msg > update success'), {
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

  // Delete Site
  const deleteSiteMutation = useMutation({
      mutationFn: (siteId) => deleteSite(siteId),
      onSuccess: () => {
        new NoticeMessage(t('msg > delete success'), {
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
      new NoticeMessage(t('msg > registration success'), {
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
  
  

  return {
    siteListData,
    detailSiteData,
    deleteSite: deleteSiteMutation.mutate,
    updateSite: updateSiteMutation.mutate,
    createSite: createSiteMutation.mutate
  };
};

export default useSiteMgt;
