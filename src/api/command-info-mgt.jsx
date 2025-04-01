import { URLS, APIS } from "../config/urls";
import { reqGet, reqPost } from "../utils/request";


// 디바이스 다중 제어
// DSH_003 - /api/dsh/command (POST)
export const createCommand = async (commandList) => {
    console.log('command-info-mgt')
    console.log(commandList)
    
    const url = `${URLS.BACK_DSH}${APIS.createCommand()}`;
    return await reqPost(url, commandList);
};


// 명령 조회
// DSH_007 - /api/dsh/command (GET)
export const fetchCommand = async () => {
    //const url = `${URLS.BACK_DSH}${APIS.command()}`;
    const url=''
    return await reqGet(url);
};
