import { URLS, APIS } from "../config/urls";
import { reqDelete, reqGet, reqPost, reqPut} from "../utils/request";


export const fetchDetectorList = async (params = "") => {
  const url = `${URLS.BACK_DSH}${APIS.detectorList(params)}`;
  return await reqGet(url);
};

