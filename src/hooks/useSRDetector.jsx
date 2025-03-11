
import { useQuery, useQueryClient } from "@tanstack/react-query";  
import { fetchSiteRoadDetector } from "../api/crossroad";


const useSRDetector = ({
  id ="",
}) => {
  const queryClient = useQueryClient();

   const { data: srDetector  } = useQuery({
    queryKey: ["srDetector", id],
    queryFn: () => fetchSiteRoadDetector(id),
    staleTime: 1000 * 60 * 1,
 });

  return {
    srDetector,
  };
};

export default useSRDetector;