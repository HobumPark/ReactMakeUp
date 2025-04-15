import { URLS, APIS } from "../config/urls";
import { reqGet } from "../utils/request";
import queryString from 'query-string';

export const fetchPopularFoundation = async (popularFoundationParams) => {
  const url = `${APIS.popularFoundation(popularFoundationParams)}`;
  return await reqGet(url);
};

export const fetchPopularEyeliner = async (popularEyelinerParams) => {
  const url = `${APIS.popularEyeliner(popularEyelinerParams)}`;
  return await reqGet(url);
};

export const fetchPopularLipstick = async (popularLiplinerParams) => {
  const url = `${APIS.popularLipstick(popularLiplinerParams)}`;
  return await reqGet(url);
};

// 왼쪽 카테고리 메뉴 (영문명 추가)
const cosmeticType = [
  { name: "face", list:["blusher","bronzer","foundation","brush"]},
  { name: "eye", list:["eyebrow","eyeliner","eyeshadow","mascara"]},
  { name: "lip", list:["lipliner","lipstick"]},
  { name: "nail", list:["nail"]},
];

export const fetchSearchCosmetics = async (searchParams) => {
  console.log('fetchSearchCosmetics')
  // 내부에서 파라미터 분해
  const queryObj=queryString.parse(searchParams)
  console.log('queryObj')
  console.log(queryObj)

  const {brand,category,product_type}=queryObj
  // 개별 파라미터 로그 찍기 (디버깅용)
  console.log('brand:', brand);
  console.log('category:', category);//face, eye, lip, nail
  console.log('product_type:', product_type);

  if(product_type==='all'){

    // category에 해당하는 타입 리스트 찾기
    const categoryItem = cosmeticType.find(item => item.name === category);
    console.log('categoryItem')
    console.log(categoryItem)
    if (!categoryItem) return [];

    // 각 product_type에 대해 URL 생성
    const urls = categoryItem.list.map(productType => {
      const newQuery = {
        brand:brand,
        product_type: productType
      };
      return `${queryString.stringify(newQuery)}`;
    });

    console.log('urls')
    console.log(urls)

    const requests = urls.map(async (url) => {
      const api = `${APIS.searchCosmetics(url)}`
      return reqGet(api);
    });
    // 모든 요청 결과 기다리기
    const results = await Promise.all(requests);
    // 응답 배열들을 하나로 합치기 (응답이 배열이라고 가정)
    const mergedResults = results.flat(); // 또는: results.reduce((acc, cur) => acc.concat(cur), []);

    return mergedResults;
  }else{
    const newQuery = {
      brand:brand,
      product_type: product_type
    };
    const url = `${queryString.stringify(newQuery)}`;

    const api = `${APIS.searchCosmetics(url)}`
    return reqGet(api);
  }

};
