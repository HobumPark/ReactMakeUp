import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import NoticeMessage from "../plugin/noticemessage/noticemessage";
import { fetchDetectorList } from "../api/detector-mgt";


const useDetectorMgt = ({
  dtID = null,
  queryParams =  "",
  onDeleteSuccess = () => {},
  onCreateSuccess = () => {},
  onUpdateSuccess = () => {},
}) => {
  const queryClient = useQueryClient();

  const { data: detectorListData } = useQuery({
    queryKey: ["detectorListData", queryParams],
    queryFn: () => fetchDetectorList(queryParams),
    staleTime: 1000 * 60 * 1,
  });

  const { data: detailBoxData} = useQuery({
    queryKey: ["detailBoxData", dtID],
    queryFn: () => fetchDetailDetector(dtID),
    retry: false, 
    enabled: !!dtID,
    onError: () => {
    },
  });
  return {
    detectorListData,
  };
};

export default useDetectorMgt;
