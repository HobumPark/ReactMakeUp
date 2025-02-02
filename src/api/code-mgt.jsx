import { URLS, APIS } from "../config/urls";
import { reqDelete, reqGet, reqPost, reqPut} from "../utils/request";

// ? [GET] Code List 
export const fetchCodeList = async (params = "") => {
  const url = `${URLS.BACK_DSH}${APIS.codeList(params)}`;
  return await reqGet(url);
};
