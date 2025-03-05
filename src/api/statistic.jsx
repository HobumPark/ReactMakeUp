import { URLS, APIS } from "../config/urls";
import { reqGet } from "../utils/request";

export const fetchObject = async (params = "") => {
  const url = `${URLS.BACK_DSH}${APIS.object(params)}`;
  return await reqGet(url);
};


export const fetchObjectTraffic = async (params = "") => {
  const url = `${URLS.BACK_DSH}${APIS.objectTraffic(params)}`;
  return await reqGet(url);
};

export const fetchObjectChart = async (params = "") => {
  const url = `${URLS.BACK_DSH}${APIS.objectChart(params)}`;
  return await reqGet(url);
};



export const fetchObjectCnt = async (params = "") => {
  const url = `${URLS.BACK_DSH}${APIS.objectCnt(params)}`;
  return await reqGet(url);
};

export const fetchObjectCntLane = async (params = "") => {
  const url = `${URLS.BACK_DSH}${APIS.objectCntLane(params)}`;
  return await reqGet(url);
};