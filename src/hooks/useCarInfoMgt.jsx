
import { useQuery, useQueryClient } from "@tanstack/react-query";  
import { fetchCarInfo, fetchCarLogData } from "../api/car-info-mgt";

const useCarInfoMgt = ({
  carInfoQueryParams,
  carLogQueryParams
}) => {
  const queryClient = useQueryClient();

  const { data: carInfo} = useQuery({
      queryKey: ["carInfoQueryParams",carInfoQueryParams],
      queryFn: () => fetchCarInfo(),
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
  });

  const { data: carLogData} = useQuery({
    queryKey: ["carLogQueryParams",carLogQueryParams],
    queryFn: () => fetchCarLogData(carLogQueryParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  return {
    carInfo,
    carLogData,
  };
};

export default useCarInfoMgt;