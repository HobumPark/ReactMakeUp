import { URLS, APIS } from "../config/urls";
import { reqGet } from "../utils/request";

export const fetchCommand1 = async (carId, params="") => {
  const url = `${URLS.BACK_DSH}${APIS.command1(carId, params)}`;
  return await reqGet(url);
};

export const fetchCommand2 = async (carId, params="") => {
    const url = `${URLS.BACK_DSH}${APIS.command2(carId, params)}`;
    return await reqGet(url);
};

export const fetchCommand3 = async (carId, params="") => {
    const url = `${URLS.BACK_DSH}${APIS.command3(carId, params)}`;
    return await reqGet(url);
};

export const fetchCommand4 = async (carId, params="") => {
    const url = `${URLS.BACK_DSH}${APIS.command4(carId, params)}`;
    return await reqGet(url);
};