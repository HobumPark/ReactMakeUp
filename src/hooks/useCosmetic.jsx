import { fetchPopularCosmetics, fetchSearchCosmetics } from "../api/cosmetic";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const useCosmetic = ({
  popularParams,
  popularFaceParams,
  popularLipParams,
  popularEyeParams,
  searchParams,
}) => {
  const { data: popularFaceList } = useQuery({
    queryKey: ["popularFaceParams", popularFaceParams],
    queryFn: () => fetchPopularFace(popularFaceParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  const { data: popularLipList } = useQuery({
    queryKey: ["popularLipParams", popularLipParams],
    queryFn: () => fetchPopularLip(popularLipParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  const { data: popularEyeList } = useQuery({
    queryKey: ["popularEyeParams", popularEyeParams],
    queryFn: () => fetchPopularEye(popularEyeParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

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
    popularFaceList,
    popularLipList,
    popularEyeList,
    searchCosmeticList,
  };
};

export default useCosmetic;