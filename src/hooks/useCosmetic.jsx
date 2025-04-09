import { fetchPopularCosmetics, fetchSearchCosmetics } from "../api/cosmetic";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const useCosmetic = ({
  popularParams,
  searchParams,
}) => {
  const { data: popularCosmeticList } = useQuery({
    queryKey: ["popularParams", popularParams],
    queryFn: () => fetchPopularCosmetics(popularParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  const { data: searchCosmeticList } = useQuery({
    queryKey: ["searchParams", searchParams],
    queryFn: () => fetchSearchCosmetics(searchParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  return {
    popularCosmeticList,
    searchCosmeticList,
  };
};

export default useCosmetic;