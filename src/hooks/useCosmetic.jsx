import { fetchSearchCosmetics} from "../api/cosmetic";
import { fetchPopularFoundation, fetchPopularLipstick, fetchPopularEyeliner } from "../api/cosmetic";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const useCosmetic = ({
  popularFoundationParams,
  popularLipstickParams,
  popularEyelinerParams,
  searchParams,
}) => {
  const { data: popularFoundationList } = useQuery({
    queryKey: ["popularFoundationParams", popularFoundationParams],
    queryFn: () => fetchPopularFoundation(popularFoundationParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  const { data: popularLipstickList } = useQuery({
    queryKey: ["popularLipstickParams", popularLipstickParams],
    queryFn: () => fetchPopularLipstick(popularLipstickParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  const { data: popularEyelinerList } = useQuery({
    queryKey: ["popularEyelinerParams", popularEyelinerParams],
    queryFn: () => fetchPopularEyeliner(popularEyelinerParams),
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
    popularFoundationList,
    popularLipstickList,
    popularEyelinerList,
    searchCosmeticList,
  };
};

export default useCosmetic;