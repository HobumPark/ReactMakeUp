import { URLS, APIS } from "../config/urls";
import { reqDelete, reqGet, reqPost, reqPut} from "../utils/request";

// ? [GET] Code List 
export const fetchCodeList = async (params = "") => {
  const url = `${URLS.BACK_DSH}${APIS.codeList(params)}`;
  return await reqGet(url);
};

export const fetchDetailCode = async (codeID) => {
  const url = `${URLS.BACK_DSH}${APIS.detailCode(
    codeID
  )}`;
  return await reqGet(url);
};

export const createUpperCode = async (codeData) => {
  const url = `${URLS.BACK_DSH}${APIS.createUpperCode}`; 
  return await reqPost(url, codeData); 
};

export const createLowerCode = async (codeData) => {
  const url = `${URLS.BACK_DSH}${APIS.createLowerCode}`; 
  return await reqPost(url, codeData); 
};

export const updateUpperCode = async (codeData) => {
  const url = `${URLS.BACK_DSH}${APIS.updateUpperCode(codeData.id)}`; 
  return await reqPut(url, codeData); 
};

export const updateLowerCode = async (codeData) => {
  const url = `${URLS.BACK_DSH}${APIS.updateLowerCode(codeData.id)}`; 
  return await reqPut(url, codeData); 
};

export const deleteCode = async (codeID) => {
  const url = `${URLS.BACK_DSH}${APIS.deleteCode(codeID)}`;
  return await reqDelete(url);
};