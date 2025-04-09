import { URLS, APIS } from "../config/urls";
import { reqGet } from "../utils/request";

export const fetchPopularCosmetics = async () => {
  const url = `${APIS.popularCosmetics}`;
  return await reqGet(url);
};

export const fetchFilterCosmetics = async (cosmeticFilterParams) => {
  const url = `${APIS.filterCosmetics(cosmeticFilterParams)}`;
  return await reqGet(url);
};
