import { URLS, APIS } from "../config/urls";
import { reqDelete, reqGet, reqPost, reqPut} from "../utils/request";


export const fetchFacilityList = async (params = "") => {
  const url = `${URLS.BACK_DSH}${APIS.facilityList(params)}`;
  return await reqGet(url);
};

