import { URLS, APIS } from "../config/urls";
import { reqGet } from "../utils/request";

export const fetchTrafficEventTime= async (params = "") => {
  console.log('fetchTrafficEventTime')
  console.log(params)
  const url = `${URLS.BACK_DSH}${APIS.trafficEventTime(params)}`;
  return await reqGet(url);
};

export const fetchTrafficEventCnt= async (params = "") => {
    console.log('fetchTrafficEventCnt')
    console.log(params)
    const url = `${URLS.BACK_DSH}${APIS.trafficEventCnt(params)}`;
    return await reqGet(url);
  };
  
  