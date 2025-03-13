import { URLS, APIS } from "../config/urls";
import { reqGet } from "../utils/request";

export const fetchSiteRoadDetector= async (id) => {
    const url = `${URLS.BACK_DSH}${APIS.siteRoadDetector(id)}`;
    return await reqGet(url);
};

export const fetchObjectCntCompass = async (params = "") => {
    const url = `${URLS.BACK_DSH}${APIS.objectCntCompass(params)}`;
    return await reqGet(url);
};

export const fetchObjectCntCompassTime = async (params = "") => {
    const url = `${URLS.BACK_DSH}${APIS.objectCntCompassTime(params)}`;
    return await reqGet(url);
};

export const fetchObjectCntMovingDirectionTime = async (params = "") => {
    const url = `${URLS.BACK_DSH}${APIS.objectCntMovingDirectionTime(params)}`;
    return await reqGet(url);
};

export const realTimeObject = async (params = "") => {
    const url = `${URLS.BACK_DSH}${APIS.realTimeObject(params)}`;
    return await reqGet(url);
};