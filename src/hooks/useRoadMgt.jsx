import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchRoadList } from "../api/road-mgt";
import { useTranslation } from "react-i18next";

const useRoadMgt = ({
  queryParams = "",
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

  return {
    roadListData,
    isLoadingRoad
  };
};

export default useRoadMgt;
