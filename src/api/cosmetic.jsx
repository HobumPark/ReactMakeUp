import { URLS, APIS } from "../config/urls";
import { reqGet } from "../utils/request";

export const fetchPopularCosmetics = async () => {
  const url = `${APIS.popularCosmetics}`;
  return await reqGet(url);
};
