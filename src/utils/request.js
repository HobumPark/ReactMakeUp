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

    return await fetch(url, {
      method: "POST",
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
  
  export const reqDelete = async (url, fetchOptions = {}) => {
    return await fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
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
        console.error("DELETE API ERROR:: \n", JSON.stringify(data, null, 2));
        handleErrorCode(response.status);
        throw data;
      });
  };
  