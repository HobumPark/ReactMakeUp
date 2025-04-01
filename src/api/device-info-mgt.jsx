import { URLS, APIS } from "../config/urls";
import { reqGet, reqPost } from "../utils/request";

// 테스트용 차량 정보
// 디바이스 목록 및 상태 조회
// DSH_001 - /api/dsh/device-status (GET)
export const fetchDeviceStatus = async () => {
    //const url = `/sampleDeviceInfo.json`;
    const url = `${URLS.BACK_DSH}${APIS.deviceStatus()}`;
    console.log('fetchDeviceStatus')
    return await reqGet(url);
};

// 하트 비트 수집
// DSH_006 - /api/dsh/heartbeat (GET)
export const fetchHeartBeat = async () => {
    //const url = `${URLS.BACK_DSH}${APIS.heartbeat()}`;
    const url=''
    return await reqPost(url);
};

// 차량 이동 경로 조회
// DSH_002 - /api/dsh/trace (GET)
export const fetchTraceData = async () => {
    console.log('fetchTraceData')
    const url = `${URLS.BACK_DSH}${APIS.trace()}`;
    return await reqGet(url);
};