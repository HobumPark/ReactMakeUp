import { URLS, APIS } from "../config/urls";  
import { reqGet, reqPost } from "../utils/request"; 


// ? [GET] Program Authenticated
export const fetchProgramAuthenticated = async (params = "") => {
  const url = `${URLS.BACK_DSH}${APIS.programAuthenticated(params)}`;
  return await reqGet(url);
};

export const fetchUpperProgram = async () => {
    const url = `${URLS.BACK_DSH}${APIS.upperProgram}`;
    return await reqGet(url);
};

export const fetchGroupPrograms = async (groupCode) => {
    const url = `${URLS.BACK_DSH}${APIS.groupProgram(groupCode)}`;
    return await reqGet(url)
};

export const assignData = async (groupCode,assignData) => {
  const url = `${URLS.BACK_DSH}${APIS.groupProgram(groupCode)}`; 
  return await reqPost(url, assignData); 
};

export const createAuthority = async (data) => {
  const url = `${URLS.BACK_DSH}${APIS.createAuthority}`; 
  return await reqPost(url, data); 
};