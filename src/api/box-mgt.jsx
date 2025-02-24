import { URLS, APIS } from "../config/urls";
import { reqDelete, reqGet, reqPost, reqPut} from "../utils/request";


export const fetchBoxList = async (params = "") => {
  const url = `${URLS.BACK_DSH}${APIS.boxList(params)}`;
  return await reqGet(url);
};

export const fetchDetailBox = async (rtuID) => {
  const url = `${URLS.BACK_DSH}${APIS.detailBox(rtuID)}`;
  return await reqGet(url);
};

export const deleteBox = async (rtuID) => {
  const url = `${URLS.BACK_DSH}${APIS.deleteBox(rtuID)}`;
  return await reqDelete(url);
};

export const createBox = async (boxData) => {
const url = `${URLS.BACK_DSH}${APIS.createBox}`; 
return await reqPost(url, boxData); 
};

export const updateBox = async (boxData) => {
const url = `${URLS.BACK_DSH}${APIS.updateBox(boxData.remote_terminal_unit_id)}`; 
return await reqPut(url, boxData); 
};



