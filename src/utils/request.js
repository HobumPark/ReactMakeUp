export const handleErrorCode = (errCode) => {
    console.log("Error Code :: ", errCode);
    if (!errCode) {
      return false;
    }
  
    switch (errCode) {
      case 403: {
        console.log("Session Expired");
        sessionStorage.clear();
        localStorage.clear();
        location.href = "/";
        break;
      }
      default:
        console.error("Undefined Code Handling", errCode);
    }
    return false;
  };
  
  export const reqGet = async (url) => {
    return await fetch(url, {
      method: "GET",
      credentials: "include",
    })
      .then(async (response) => {
        //console.log('reqGet')
        //console.log(response)
        const contentType = response.headers.get("Content-Type");
        const responseData =
          contentType && contentType.indexOf("application/json") !== -1
            ? await response.json()
            : await response.text();
  
        if (!response.ok) {
          throw { response, data: responseData };
        }
  
        return responseData;
      })
      .catch(async (err) => {
        const { response, data } = await err;
        console.error("GET API ERROR:: \n", JSON.stringify(data, null, 2));
        throw data;
      });
  };
  
  export const reqPost = async (
    url,
    receivedDT,
    isStringify = true,
    fetchOptions = {}
  ) => {

    console.log('post url')
    console.log(receivedDT)
    
    return await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: isStringify ? JSON.stringify(receivedDT) : receivedDT,
      ...fetchOptions,
    })
      .then(async (response) => {
        console.log('post response')
        console.log(response)
        
        const contentType = response.headers.get("Content-Type");
        const responseData =
          contentType && contentType.indexOf("application/json") !== -1
            ? await response.json()
            : await response.text();
  
        if (!response.ok) {
          throw { response, data: responseData };
        }
        return responseData;
      })
      .catch(async (err) => {
        const { response, data } = await err;
        console.error("POST API ERROR:: \n", JSON.stringify(data, null, 2));
        handleErrorCode(response.status);
        throw data;
      });
  };
  
  export const reqPut = async (
    url,
    receivedDT,
    isStringify = true,
    fetchOptions = {}
  ) => {
    //console.log('reqPut')
    //console.log(url)
    //console.log(receivedDT)
    return await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: isStringify ? JSON.stringify(receivedDT) : receivedDT,
      ...fetchOptions,
    })
      .then(async (response) => {
        const contentType = response.headers.get("Content-Type");
        const responseData =
          contentType && contentType.indexOf("application/json") !== -1
            ? await response.json()
            : await response.text();
  
        if (!response.ok) {
          throw { response, data: responseData };
        }
        return responseData;
      })
      .catch(async (err) => {
        const { response, data } = await err;
        console.error("PUT API ERROR:: \n", JSON.stringify(data, null, 2));
        handleErrorCode(response.status);
        throw data;
      });
  };
  
  export const reqDelete = async (url, receivedDT, isStringify = true, fetchOptions = {}) => {
    //console.log('reqDelete');
    //console.log(url);
    //console.log(receivedDT);
  
    // 요청 본문에 포함할 데이터 문자열로 변환
    const body = isStringify ? JSON.stringify(receivedDT) : receivedDT;
  
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "accept": "application/json" // 응답으로 JSON을 받기 위한 설정
        },
        credentials: "include", // 인증 필요 시
        body: body,
        ...fetchOptions, // 추가적인 fetch 옵션
      });
  
      // 응답 상태 확인
      console.log('Response Status:', response.status);
      const contentType = response.headers.get("Content-Type");
      const responseData =
        contentType && contentType.indexOf("application/json") !== -1
          ? await response.json()
          : await response.text();
  
      console.log('Response Data:', responseData);
  
      // 실패한 경우 에러를 던짐
      if (!response.ok) {
        throw { response, data: responseData };
      }
  
      return responseData;
    } catch (err) {
      const { response, data } = await err;
      console.error("DELETE API ERROR:: ", err);
      console.error("Response Error:", response);
      console.error("Error Data:", data);
      handleErrorCode(response.status); // 에러 코드 처리
      throw data;  // 에러를 호출자에게 던짐
    }
  };
  