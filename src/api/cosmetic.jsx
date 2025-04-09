import { URLS, APIS } from "../config/urls";
import { reqGet } from "../utils/request";

export const fetchPopularCosmetics = async (popularParams) => {
  const url = `${APIS.popularCosmetics(popularParams)}`;
  return await reqGet(url);
};

export const fetchSearchCosmetics = async (searchParams) => {
  console.log('fetchSearchCosmetics')
  console.log(searchParams)
  const url = `${APIS.searchCosmetics(searchParams)}`;
  return await reqGet(url);
};
