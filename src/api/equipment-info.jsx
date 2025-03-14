import { URLS, APIS } from "../config/urls";
import {reqGet, reqPost} from "../utils/request";

export const fetchBox= async (id) => {
    const url = `${URLS.BACK_DSH}${APIS.box(id)}`;
    return await reqGet(url);
};

export const fetchBoxStatus= async (id) => {
    const url = `${URLS.BACK_DSH}${APIS.boxStatus(id)}`;
    return await reqGet(url);
};

export const fetchBoxEvent= async (id, params="") => {
    const url = `${URLS.BACK_DSH}${APIS.boxEvent(id, params)}`;
    return await reqGet(url);
};

export const fetchBoxEventCnt= async (id) => {
    const url = `${URLS.BACK_DSH}${APIS.boxEventCnt(id)}`;
    return await reqGet(url);
};

export const fetchBoxTempHum= async (id, params="") => {
    const url = `${URLS.BACK_DSH}${APIS.boxTempHum(id,params)}`;
    return await reqGet(url);
};

export const boxCommand = async (rtuID, command) => {
    const url = `${URLS.BACK_ENV}${APIS.boxCommand(rtuID)}`; 
    return await reqPost(url, command); 
    };

export const mosCommand = async (siteID, command) => {
    const url = `${URLS.BACK_ENV}${APIS.mosCommand(siteID)}`; 
    return await reqPost(url, command); 
};
