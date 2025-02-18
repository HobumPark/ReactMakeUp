import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import NoticeMessage from "../plugin/noticemessage/noticemessage.js";
import { fetchBoxList } from "../api/box-mgt.jsx";

const useBoxMgt = ({
  rtuID = null,
  queryParams =  "",
  onDeleteSuccess = () => {},
  onCreateSuccess = () => {},
  onUpdateSuccess = () => {},
}) => {
  const queryClient = useQueryClient();
  const { data: boxListData } = useQuery({
    queryKey: ["boxListData", queryParams],
    queryFn: () => fetchBoxList(queryParams),
    staleTime: 1000 * 60 * 1,
  });

  return {
    boxListData,
  };
};

export default useBoxMgt;
