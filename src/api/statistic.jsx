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
