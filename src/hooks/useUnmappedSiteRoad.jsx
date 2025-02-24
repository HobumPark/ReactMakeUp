
import { useQuery } from "@tanstack/react-query";  
import { fetchUnmappedSiteRoad } from "../api/unmapped-site-road";

const useUnmappedSiteRoad = ({ resource = "" } = {}) => {
  const { data: unmappedSiteRoad } = useQuery({
    queryKey: ["unmappedSiteRoad", resource],
    queryFn: () => fetchUnmappedSiteRoad(resource),
    staleTime: 1000 * 60 * 1,
    onError: (err) => {
      console.error("Error fetching codes:", err);
    },
  });

  return { unmappedSiteRoad };
};

export default useUnmappedSiteRoad;
