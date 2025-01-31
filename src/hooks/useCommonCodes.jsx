
import { useQuery } from "@tanstack/react-query";  
import { fetchCommonCodes } from "../api/common-codes";

const useCommonCodes = ({ optionParams = "" } = {}) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["commonListData", optionParams],  
    queryFn: () => fetchCommonCodes(optionParams),  
    staleTime: 1000 * 60 * 1, 
  });

  if (error) {
    console.error("Error fetching common codes:", error);
  }

  return { commonListData: data, error, isLoading };
};

export default useCommonCodes;
