import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchDeviceLogData, deleteLog } from "../api/log-info-mgt";

const useLogMgt = ({
  deviceLogQueryParams
}) => {
  const queryClient = useQueryClient();

  //로그 파일 목록 조회
  const { data: deviceLogData} = useQuery({
    queryKey: ["deviceLogQueryParams",deviceLogQueryParams],
    queryFn: () => fetchDeviceLogData(deviceLogQueryParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });


  //로그 목록 삭제
  const deleteLogListMutation =  useMutation({
    mutationFn: async (logList) => {
      const requests = [];
      console.log('deleteLogListMutation')
      console.log('logList')
      console.log(logList)

      for (let i = 0; i < logList.length; i++) {
        const logId = logList[i];
        // 각 roadInfo에 대해 updateSite 요청을 추가
        requests.push(deleteLog(logId));
      }
      console.log('requests')
      console.log(requests)
      return await Promise.all(requests);
    },
    
    onSuccess:(responseData) =>{
      new NoticeMessage(t('정상적으로 삭제되었습니다.'), {
        callback() {
          queryClient.invalidateQueries(["deviceLogQueryParams", deviceLogQueryParams]);
          onDeleteSuccess(responseData);
        }
      });
    },
    onError:(err) => {
      new NoticeMessage(t(err.message))
    }   
  })

  return {
    deviceLogData,
    deleteLogList: deleteLogListMutation.mutate,
  };
};

export default useLogMgt;