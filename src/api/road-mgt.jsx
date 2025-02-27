import { URLS, APIS } from "../config/urls";
import { reqDelete, reqGet, reqPost, reqPut} from "../utils/request";

// [GET] Road List with Side Id 
export const fetchRoadList = async (params = "") => {
  const url = `${URLS.BACK_DSH}${APIS.roadList(params)}`;
  return await reqGet(url);
};

// [DELETE] Delete Road
export const deleteRoad = async (roadId) => {
  const url = `${URLS.BACK_DSH}${APIS.deleteRoad(roadId)}`;
  return await reqDelete(url);
};

// [POST] Create Road
export const createRoad = async (roadData) => {
  const url = `${URLS.BACK_DSH}${APIS.createRoad}`; 
  return await reqPost(url, roadData); 
};

// [PUT] Update Road
export const updateRoad = async (roadId, roadData) => {
  console.log('updateRoad(road-mgt)')
  console.log(roadId)
  console.log(roadData)
  
  const url = `${URLS.BACK_DSH}${APIS.updateRoad(roadId)}`; 
  return await reqPut(url, roadData); 
};