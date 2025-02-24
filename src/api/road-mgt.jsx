import { URLS, APIS } from "../config/urls";
import { reqDelete, reqGet, reqPost, reqPut} from "../utils/request";

// [GET] Road List with Side Id 
export const fetchRoadList = async (params = "") => {
  const url = `${URLS.BACK_DSH}${APIS.roadList(params)}`;
  return await reqGet(url);
};
