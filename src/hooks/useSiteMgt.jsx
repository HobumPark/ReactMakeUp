import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSiteList } from "../api/site-mgt";
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

  return {
    siteListData,

  };
};

export default useSiteMgt;
