import { URLS, APIS } from "../config/urls";
import { reqGet } from "../utils/request";

export const fetchMapInitial = async () => {
  const url = `${URLS.BACK_DSH}${APIS.mapInitialView}`;
  return await reqGet(url);
};

export const fetchMapDisplayPOI = async () => {
    const url = `${URLS.BACK_DSH}${APIS.mapDisplayPOI}`;
    return await reqGet(url);
};

export const fetchSiteRoad= async (params = "") => {
    const url = `${URLS.BACK_DSH}${APIS.siteRoad(params)}`;
    return await reqGet(url);
};

export const fetchTrafficEventTime= async (params = "") => {
  console.log('fetchTrafficEventTime')
  console.log(params)
  const url = `${URLS.BACK_DSH}${APIS.trafficEventTime(params)}`;
  return await reqGet(url);
};

export const fetchTrafficEvent= async (id) => {
    const url = `${URLS.BACK_DSH}${APIS.trafficEvent(id)}`;
    return await reqGet(url);
};

export const fetchObjectUnqCnt= async (params = "") => {
    const url = `${URLS.BACK_DSH}${APIS.objectUnqCnt(params)}`;
    return await reqGet(url);
};

export const fetchObjectUnqCntRoad= async (params = "") => {
    const url = `${URLS.BACK_DSH}${APIS.objectUnqCntRoad(params)}`;
    return await reqGet(url);
};
