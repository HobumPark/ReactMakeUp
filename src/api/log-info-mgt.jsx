import { URLS, APIS } from "../config/urls";
import { reqGet, reqPost, reqDelete } from "../utils/request";

// 테스트용 차량 로그 정보
// 로그 파일 목록 조회
// DSH_004 - /api/dsh/log (GET)
export const fetchDeviceLogData = async () => {
    const url = `/sampleDeviceLogData.json`;
    //const url = `${URLS.BACK_DSH}${APIS.logList()}`;
    return await reqGet(url);
};

// 로그 파일 삭제
// DSH_005 - /api/dsh/log (DELETE)
export const deleteLog = async (logId) => {
    //const url = `/sampleDeviceLogData.json`;
    console.log('deleteLog')
    console.log(logId)
    
    const url = `${URLS.BACK_DSH}${APIS.logDelete(logId)}`;
    //const url=''
    return await reqDelete(url);
};

