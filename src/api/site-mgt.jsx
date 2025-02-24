import { URLS, APIS } from "../config/urls";
import { reqDelete, reqGet, reqPost, reqPut} from "../utils/request";

// [GET] Site List 
export const fetchSiteList = async (params = "") => {
  const url = `${URLS.BACK_DSH}${APIS.siteList(params)}`;
  return await reqGet(url);
};

// [GET] Detail Site Info 
export const fetchDetailSite = async (siteId) => {
  const url = `${URLS.BACK_DSH}${APIS.detailSite(
    siteId
  )}`;
  return await reqGet(url);
};  

// [DELETE] Delete Site
export const deleteSite = async (siteId) => {
  const url = `${URLS.BACK_DSH}${APIS.deleteSite(siteId)}`;
  return await reqDelete(url);
};

// [PUT] Update Site
export const updateSite = async (siteData) => {
  console.log('site-mgt')
  console.log(siteData)
  const siteId = siteData.site_id
  console.log(siteId)

  const url = `${URLS.BACK_DSH}${APIS.updateSite(siteId)}`; 
  return await reqPut(url, siteData); 
};

// [POST] Create Site
export const createSite = async (siteData) => {
  const url = `${URLS.BACK_DSH}${APIS.createSite}`; 
  return await reqPost(url, siteData); 
};