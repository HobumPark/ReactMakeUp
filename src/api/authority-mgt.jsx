import { URLS, APIS } from "../config/urls";
import { reqDelete, reqGet, reqPost, reqPut} from "../utils/request";

export const fetchInitialAuthority = async (params = "") => {
  const url = `${URLS.BACK_DSH}${APIS.initialAuthority(params)}`;
  return await reqGet(url);
};
