import { URLS, APIS } from "../config/urls";
import { reqDelete, reqGet, reqPost, reqPut} from "../utils/request";


export const fetchFacilityList = async (params = "") => {
  const url = `${URLS.BACK_DSH}${APIS.facilityList(params)}`;
  return await reqGet(url);
};

export const fetchDetailFacility = async (fcID) => {
  const url = `${URLS.BACK_DSH}${APIS.detailFacility(fcID)}`;
  return await reqGet(url);
};

export const deleteFacility = async (fcID) => {
  const url = `${URLS.BACK_DSH}${APIS.deleteFacility(fcID)}`;
  return await reqDelete(url);
};

export const createFacility = async (facilityData) => {
const url = `${URLS.BACK_DSH}${APIS.createFacility}`; 
return await reqPost(url, facilityData); 
};

export const updateFacility = async (facilityData) => {
const url = `${URLS.BACK_DSH}${APIS.updateFacility(facilityData.facility_id)}`; 
return await reqPut(url, facilityData); 
};
