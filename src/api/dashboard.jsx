import { URLS, APIS } from "../config/urls";
import { reqGet } from "../utils/request";

export const fetchMapInitial = async () => {
  const url = `${URLS.BACK_DSH}${APIS.mapInitialView}`;
  return await reqGet(url);
};

export const fetchMapDisplayPOI = async () => {
    const url = `${URLS.BACK_DSH}${APIS.mapDisplayPOI}`;
    return await reqGet(url);
};

//테스트용 차량 정보
export const fetchCarInfoTest = async () => {
    const url = `/sampleDeviceInfo.json`;
    return await reqGet(url);
};
//테스트용 차량위치 정보-10개
export const fetchMapDisplayPOITest = async () => {
    const url = `/sampleDeviceMovingData.json`;
    return await reqGet(url);
};
//테스트용 차량위치 정보-1개
export const fetchMapDisplayPOIOneTest = async () => {
    const url = `/sampleDeviceMovingOneData.json`;
    return await reqGet(url);
};
