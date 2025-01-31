import { URLS } from "../config/urls";  
import { reqGet } from "../utils/request"; 


// ? [GET] Common Codes
export const fetchCommonCodes = async (params = "") => {
  const url = `${URLS.BACK_DSH}/common/common-codes${params ? `?${params}` : ""}`; 
  return await reqGet(url);  
};
