import { URLS, APIS } from "../config/urls";
import { reqDelete, reqGet, reqPost, reqPut} from "../utils/request";

// ? [GET] Site List 
export const fetchSiteList = async (params = "") => {
  const url = `${URLS.BACK_DSH}${APIS.siteList(params)}`;
  return await reqGet(url);
};
