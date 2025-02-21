import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import NoticeMessage from "../plugin/noticemessage/noticemessage";
import { fetchFacilityList } from "../api/facility-mgt";


const useFacilityMgt = ({
  fcID = null,
  queryParams =  "",
  onDeleteSuccess = () => {},
  onCreateSuccess = () => {},
  onUpdateSuccess = () => {},
}) => {
  const queryClient = useQueryClient();

  const { data: facilityListData } = useQuery({
    queryKey: ["facilityListData", queryParams],
    queryFn: () => fetchFacilityList(queryParams),
    staleTime: 1000 * 60 * 1,
  });

  return {
    facilityListData,
  };
};

export default useFacilityMgt;
