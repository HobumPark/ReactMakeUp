import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchDeviceLogData, deleteLogs } from "../api/log-info-mgt";

const useLogMgt = ({
  deviceLogQueryParams
}) => {
  const queryClient = useQueryClient();

  //로그 파일 목록 조회
  const { data: deviceLogData, isFetching} = useQuery({
    queryKey: ["deviceLogQueryParams",deviceLogQueryParams],
    queryFn: () => fetchDeviceLogData(),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });


  //로그 목록 삭제
  const deleteLogListMutation = useMutation({
    mutationFn: (logList) => deleteLogs(logList),
    onSuccess: () => {
      new NoticeMessage(t('msg > delete success'), {
        callback() {
          onDeleteSuccess();
          queryClient.invalidateQueries(["deviceLogQueryParams", deviceLogQueryParams]);
        }
      });
    },
    onError: (err) => {
      new NoticeMessage(t(err.message))
    },
  });
  /*
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
  */

  return {
    deviceLogData,
    isFetching, // 로딩 상태를 사용하여 UI에서 처리
    deleteLogList: deleteLogListMutation.mutate,
  };
};

export default useLogMgt;