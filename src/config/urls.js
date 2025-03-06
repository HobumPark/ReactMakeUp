// ! Warning: The DEBUG changes may cause issues with the production server.
const isDebugMode = import.meta.env.DEV;
export const DEBUG = isDebugMode;

const host = location.protocol + "//" + location.hostname;
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
  checkStatus:'/authentication/check-status',
  accessMenu: '/program-navbar',
  userLanguage:'/common/authenticated-user/language-preference',
  language:'/common/authenticated-user/languages',
  programLanguage:'/common/authenticated-user/programs',
  login: "/authentication/login",
  logout:"/authentication/logout",
  //user
  usersList: (filterParams) => `/users?${filterParams}`,
  detailUser: (userID) =>
    `/users/${userID}`,
  deleteUser: (userID) =>
    `/users/${userID}`,
  createUser: '/users',
  updateUser: '/users/update',
  //code
  codeList: (filterParams) => `/codes?${filterParams}`,
  detailCode: (codeID) =>
    `/codes/${codeID}`,
  createUpperCode: '/codes',
  createLowerCode: '/codes/lower',
  updateUpperCode: (codeID) =>
    `/codes/${codeID}`,
  updateLowerCode: (codeID) =>
    `/codes/lower/${codeID}`,
  deleteCode: (codeID) =>
    `/codes/${codeID}`,
  initialAuthority: (filterParams) => `/authority/groups?${filterParams}`,
  programAuthenticated: (filterParams) => `/programs/authenticated-user-language?${filterParams}`,
  upperProgram: '/programs/upper-programs',
  groupProgram: (groupCode) => `/authority/groups/${groupCode}/programs`,
  //program
  programList: (filterParams) => `/programs?${filterParams}`,
  detailProgram: (programID) =>
    `/programs/${programID}`,
  createUpperProgram: '/programs',
  createLowerProgram: '/programs/lower',
  updateUpperProgram: (programID) =>
    `/programs/${programID}`,
  updateLowerProgram: (programID) =>
    `/programs/lower/${programID}`,
  deleteProgram: (programID) =>
    `/programs/${programID}`,
  initialAuthorityUser: (filterParams) => `/authority/groups/users?${filterParams}`,
  authorityUserAssignInfo: (groupCode) => `/authority/groups/${groupCode}/users`,
  authorityUserInfo: (groupCode) => `/authority/groups/${groupCode}`,
  createAuthority: '/authority/groups',
  forgotPassword: '/forgot-password',
  updateProfileByUser :'/users/update-user',
  updateProfilePassword: '/users/update-password',
  unmappedSiteRoad: (filterParams) => `/unmapped-site-road?${filterParams}`,
  //box
  boxList: (filterParams) => `/box?${filterParams}`,
  detailBox: (rtuID) =>`/box/${rtuID}`,
  deleteBox: (rtuID) =>`/box/${rtuID}`,
  createBox: '/box',
  updateBox: (rtuID) =>`/box/${rtuID}`,
  //detector
  detectorList: (filterParams) => `/detector?${filterParams}`,
  detailDetector: (dtID) =>`/detector/${dtID}`,
  deleteDetector: (dtID) =>`/detector/${dtID}`,
  createDetector: '/detector',
  updateDetector: (dtID) =>`/detector/${dtID}`,
  //site
  siteList:(filterParams) => `/site?${filterParams}`,
  detailSite: (siteId)=>`/site/${siteId}`,
  updateSite: (siteId)=>`/site/${siteId}`,
  deleteSite: (siteId)=>`/site/${siteId}`,
  createSite: '/site',
  //facility
  facilityList: (filterParams) => `/facility?${filterParams}`,
  detailFacility: (fcID) =>`/facility/${fcID}`,
  deleteFacility: (fcID) =>`/facility/${fcID}`,
  createFacility: '/facility',
  updateFacility: (fcID) =>`/facility/${fcID}`,
  //road
  roadList:(filterParams) => `/road?${filterParams}`,
  createRoad:'/road',
  deleteRoad:(roadId) => `/road/${roadId}`,
  updateRoad: (roadId)=>`/road/${roadId}`,
  //statistic
  object:(filterParams) => `/object?${filterParams}`,
  objectTrafficAll:(filterParams) => `/object-traffic/all?${filterParams}`,
  objectTraffic:(filterParams) => `/object-traffic/aggregated?${filterParams}`,
  objectCnt:(filterParams) => `/object-cnt/vehicle?${filterParams}`,
  objectCntAll:(filterParams) => `/object-cnt/vehicle-all?${filterParams}`,
  objectCntLane:(filterParams) => `/object-cnt/lane?${filterParams}`,
  objectCntLaneAll:(filterParams) => `/object-cnt/lane-all?${filterParams}`,
}
