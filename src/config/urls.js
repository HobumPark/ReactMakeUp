// ! Warning: The DEBUG changes may cause issues with the production server.
const isDebugMode = import.meta.env.DEV;
export const DEBUG = isDebugMode;

const host = location.protocol + "//" + location.hostname;
let URLS = {
  FRONT: `${host}`,
  BACK_DSH: `${host}/api/dsh`,
  BACK_ENV: `${host}/api/env`,
};

if (DEBUG) {
  // for development
  URLS = {
    FRONT: `${host}:5173`,
    BACK_DSH: `${host}:7140/api/dsh`,//waties dsh sample port
    BACK_ENV: `${host}:7121/api/env`,
    url: 'http://192.168.20.200:7120/api/dsh'
  };
}

export { URLS };

export const APIS = {
  popularCosmetics:(popularParams)=>`/api/v1/products.json?${popularParams}`, //
  searchCosmetics:(cosmeticSearchParams)=>`/api/v1/products.json?${cosmeticSearchParams}`, //
}
