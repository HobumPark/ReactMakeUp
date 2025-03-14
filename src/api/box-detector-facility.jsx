import { URLS, APIS } from "../config/urls";  
import { reqGet } from "../utils/request"; 

// ? [GET] 
export const fetchBoxDetectorFacilityList = async (siteId) => {
  const url = `${URLS.BACK_DSH}${APIS.boxDetectorFacilityList(siteId)}`;
  return await reqGet(url);
};