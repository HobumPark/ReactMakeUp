import { URLS, APIS } from "../config/urls";
import { reqGet } from "../utils/request"; 

export const fetchUnmappedSiteRoad = async (params = "") => {
  const url = `${URLS.BACK_DSH}${APIS.unmappedSiteRoad(params)}`;
  return await reqGet(url);
};
