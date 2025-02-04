import { URLS, APIS } from "../config/urls";
import { reqDelete, reqGet, reqPost, reqPut} from "../utils/request";

// ? [GET] program List 
export const fetchProgramList = async (params = "") => {
  const url = `${URLS.BACK_DSH}${APIS.programList(params)}`;
  return await reqGet(url);
};

export const fetchDetailProgram = async (programID) => {
  const url = `${URLS.BACK_DSH}${APIS.detailProgram(
    programID
  )}`;
  return await reqGet(url);
};

export const createUpperProgram = async (programData) => {
  const url = `${URLS.BACK_DSH}${APIS.createUpperProgram}`; 
  return await reqPost(url, programData); 
};

export const createLowerProgram = async (programData) => {
  const url = `${URLS.BACK_DSH}${APIS.createLowerProgram}`; 
  return await reqPost(url, programData); 
};

export const updateUpperProgram = async (programData) => {
  const url = `${URLS.BACK_DSH}${APIS.updateUpperProgram(programData.id)}`; 
  return await reqPut(url, programData); 
};

export const updateLowerProgram = async (programData) => {
  const url = `${URLS.BACK_DSH}${APIS.updateLowerProgram(programData.id)}`; 
  return await reqPut(url, programData); 
};

export const deleteProgram = async (programID) => {
  const url = `${URLS.BACK_DSH}${APIS.deleteProgram(programID)}`;
  return await reqDelete(url);
};