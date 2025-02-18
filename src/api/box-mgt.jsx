import { URLS, APIS } from "../config/urls";
import { reqDelete, reqGet, reqPost, reqPut} from "../utils/request";


export const fetchBoxList = async (params = "") => {
  const url = `${URLS.BACK_DSH}${APIS.boxList(params)}`;
  return await reqGet(url);
};

