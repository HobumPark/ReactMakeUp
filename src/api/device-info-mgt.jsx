import { URLS, APIS } from "../config/urls";
import { reqGet, reqPost } from "../utils/request";

// 테스트용 차량 정보
// 디바이스 목록 및 상태 조회
// DSH_001 - /api/dsh/device-status (GET)
export const fetchDeviceStatus = async () => {
    const url = `/sampleDeviceInfo.json`;
    //const url = `${URLS.BACK_DSH}${APIS.deviceStatus()}`;
    return await reqGet(url);
};

// 차량 이동 경로 조회
// DSH_002 - /api/dsh/trace (GET)
export const fetchTraceData = async () => {
    //const url = `${URLS.BACK_DSH}${APIS.trace()}`;
    const url=''
    return await reqGet(url);
};

// 디바이스 다중 제어
// DSH_003 - /api/dsh/command (POST)
export const fetchMultiDeviceCommand = async () => {
    const url = ``;
    //const url = `${URLS.BACK_DSH}${APIS.multiCommand()}`;
    return await reqPost(url);
};

// 테스트용 차량 로그 정보
// 로그 파일 목록 조회
// DSH_004 - /api/dsh/log (GET)
export const fetchDeviceLogData = async () => {
    const url = `/sampleDeviceLogData.json`;
    //const url = `${URLS.BACK_DSH}${APIS.log()}`;
    return await reqGet(url);
};

// 로그 파일 삭제
// DSH_005 - /api/dsh/log (GET)
export const fetchDeleteLog = async () => {
    //const url = `/sampleDeviceLogData.json`;
    //const url = `${URLS.BACK_DSH}${APIS.log()}`;
    const url=''
    return await reqDelete(url);
};

// 하트 비트 수집
// DSH_006 - /api/dsh/heartbeat (GET)
export const fetchHeartBeat = async () => {
    //const url = `${URLS.BACK_DSH}${APIS.heartbeat()}`;
    const url=''
    return await reqPost(url);
};

// 명령 조회
// DSH_007 - /api/dsh/command (GET)
export const fetchCommand = async () => {
    //const url = `${URLS.BACK_DSH}${APIS.command()}`;
    const url=''
    return await reqGet(url);
};
