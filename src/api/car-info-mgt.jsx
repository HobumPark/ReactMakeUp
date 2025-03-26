import { URLS, APIS } from "../config/urls";
import { reqGet } from "../utils/request";

//테스트용 차량 정보
export const fetchCarInfo = async () => {
    const url = `/sampleCarInfo.json`;
    return await reqGet(url);
};

//테스트용 차량 로그 정보
export const fetchCarLogData = async () => {
    const url = `/sampleCarLogData.json`;
    return await reqGet(url);
};