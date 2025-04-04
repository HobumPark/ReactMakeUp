import { fetchPopularCosmetics } from "../api/cosmetic";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const useCosmetic = ({
    cosmeticQueryParams
}) => {
  //화장품 목록
  const { data: popularCostmeticList} = useQuery({
    queryKey: ["cosmeticQueryParams",cosmeticQueryParams],
    queryFn: () => fetchPopularCosmetics(),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  return {
    popularCostmeticList
  };
};

export default useCosmetic;