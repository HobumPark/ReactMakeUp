import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSiteList, deleteSite, updateSite } from "../api/site-mgt";
import NoticeMessage from "../plugin/noticemessage/noticemessage";
import { useTranslation } from "react-i18next";

const useSiteMgt = ({
  queryParams =  "",
 
}) => {
  const queryClient = useQueryClient();
  const {t} = useTranslation();
  // Query to fetch site list
  const { data: siteListData, error: siteListError, isLoading: isLoadingSites } = useQuery({
    queryKey: ["siteListData", queryParams],
    queryFn: () => fetchSiteList(queryParams),
    staleTime: 1000 * 60 * 1,
  });

  // Update Site
  const updateSiteMutation = useMutation({
        mutationFn: (siteData) => {
          console.log('mutationFn:', siteData);  // 여기서 값을 확인
          return updateSite(siteData);
        },
        onSuccess: (responseData) => {
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

  return {
    siteListData,
    deleteSite: deleteSiteMutation.mutate,
    updateSite: updateSiteMutation.mutate
  };
};

export default useSiteMgt;
