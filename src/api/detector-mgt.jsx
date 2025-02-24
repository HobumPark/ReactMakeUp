import { URLS, APIS } from "../config/urls";
import { reqDelete, reqGet, reqPost, reqPut} from "../utils/request";


export const fetchDetectorList = async (params = "") => {
  const url = `${URLS.BACK_DSH}${APIS.detectorList(params)}`;
  return await reqGet(url);
};

export const fetchDetailDetector = async (dtID) => {
  const url = `${URLS.BACK_DSH}${APIS.detailDetector(dtID)}`;
  return await reqGet(url);
};

export const deleteDetector = async (dtID) => {
  const url = `${URLS.BACK_DSH}${APIS.deleteDetector(dtID)}`;
  return await reqDelete(url);
};

export const createDetector = async (detectorData) => {
const url = `${URLS.BACK_DSH}${APIS.createDetector}`; 
return await reqPost(url, detectorData); 
};

export const updateDetector = async (detectorData) => {
const url = `${URLS.BACK_DSH}${APIS.updateDetector(detectorData.detector_id)}`; 
return await reqPut(url, detectorData); 
};
