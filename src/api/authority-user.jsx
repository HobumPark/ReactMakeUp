import { URLS, APIS } from "../config/urls";  
import { reqGet, reqPost } from "../utils/request"; 


// ? [GET] Authenticated
export const fetchUserAuthenticated = async (params = "") => {
  const url = `${URLS.BACK_DSH}${APIS.initialAuthorityUser(params)}`;
  return await reqGet(url);
};

export const fetchAuthorityUserAssign = async (groupCode) => {
  const url = `${URLS.BACK_DSH}${APIS.authorityUserAssignInfo(groupCode)}`;
  return await reqGet(url)
};

export const fetchAuthorityUserInfo = async (groupCode) => {
  const url = `${URLS.BACK_DSH}${APIS.authorityUserInfo(groupCode)}`;
  return await reqGet(url)
};