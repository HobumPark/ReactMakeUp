// ! Warning: The DEBUG changes may cause issues with the production server.
const isDebugMode = import.meta.env.DEV;
export const DEBUG = isDebugMode;

const host = location.protocol + "//" + location.hostname;
// const host = 'http://192.168.20.200:7120';
let URLS = {
  FRONT: `${host}`,
  BACK_CORE: `${host}/api/core`,
  BACK_DSH: `${host}/api/dsh`,
};

if (DEBUG) {
  // for development
  URLS = {
    // FRONT: `${host}:7100`,
    FRONT: `${host}:5173`,
    BACK_CORE: `${host}:7100/api/core`,
    BACK_DSH: `${host}:7120/api/dsh`,
  };
}

export { URLS };

export const APIS = {
  login: "/authentication/login",
  logout:"/authentication/logout",
  usersList: (filterParams) => `/users?${filterParams}`,
  detailUser: (userID) =>
    `/users/${userID}`,
  deleteUser: (userID) =>
    `/users/${userID}`,
  createUser: '/users',
  updateUser: '/users/update'
};
