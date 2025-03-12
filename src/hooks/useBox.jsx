import { useQuery, useQueryClient } from "@tanstack/react-query";  
import { fetchBox, fetchBoxEvent, fetchBoxEventCnt, fetchBoxStatus, fetchBoxTempHum } from "../api/equipment-info";

const useBox = ({
  id ="",
  boxTempHumpParams="",
  boxEventParams = ""
}) => {
  const queryClient = useQueryClient();

    const { data: boxData } = useQuery({
        queryKey: ["boxData", id],
        queryFn: () => fetchBox(id),
        retry: false, 
        enabled: !!id,
        staleTime: 1000 * 60 * 1,
        onError: () => {
      },
    });

    const { data: boxStatusData } = useQuery({
        queryKey: ["boxStatusData", id],
        queryFn: () => fetchBoxStatus(id),
        retry: false, 
        enabled: !!id,
        staleTime: 1000 * 60 * 1,
        onError: () => {
        },
      });

    const { data: BoxEventDataList } = useQuery({
        queryKey: ["BoxEventDataList", id, boxEventParams],
        queryFn: () => fetchBoxEvent(id, boxEventParams),
        retry: false, 
        enabled: !!id,
        staleTime: 1000 * 60 * 1,
        onError: () => {
        },
      });

    const { data: boxEventCntData } = useQuery({
        queryKey: ["boxEventCntData", id],
        queryFn: () => fetchBoxEventCnt(id),
        retry: false, 
        enabled: !!id,
        staleTime: 1000 * 60 * 1,
        onError: () => {
        },
      });

    const { data: boxTempHumData } = useQuery({
        queryKey: ["boxTempHumData", id, boxTempHumpParams],
        queryFn: () => fetchBoxTempHum(id,boxTempHumpParams  ),
        retry: false, 
        enabled: !!id,
        staleTime: 1000 * 60 * 1,
        onError: () => {
        },
      });
   
  return {
    boxData,
    boxStatusData,
    BoxEventDataList,
    boxEventCntData,
    boxTempHumData
  };
};

export default useBox;