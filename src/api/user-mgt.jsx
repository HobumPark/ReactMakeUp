import { URLS, APIS } from "../config/urls";
import { reqDelete, reqGet, reqPost, reqPut} from "../utils/request";

// ? [GET] User List 
export const fetchUserList = async (params = "") => {
  const url = `${URLS.BACK_DSH}${APIS.usersList(params)}`;
  return await reqGet(url);
};


// ? [GET] Detail User Info 
export const fetchDetailUser = async (userID) => {
    const url = `${URLS.BACK_DSH}${APIS.detailUser(
      userID
    )}`;
    return await reqGet(url);
};

export const deleteUser = async (userID) => {
    const url = `${URLS.BACK_DSH}${APIS.deleteUser(userID)}`;
    return await reqDelete(url);
};

export const createUser = async (userData) => {
  const url = `${URLS.BACK_DSH}${APIS.createUser}`; 
  return await reqPost(url, userData); 
};

export const updateUser = async (userData) => {
  const url = `${URLS.BACK_DSH}${APIS.updateUser}`; 
  return await reqPut(url, userData); 
};


