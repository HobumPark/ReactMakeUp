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
    rl: 'http://192.168.20.200:7120/api/dsh'
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
  //
  initialAuthorityUser: (filterParams) => `/authority/groups/users?${filterParams}`,
  authorityUserAssignInfo: (groupCode) => `/authority/groups/${groupCode}/users`,
  authorityUserInfo: (groupCode) => `/authority/groups/${groupCode}`,
  createAuthority: '/authority/groups',
  forgotPassword: '/forgot-password',
  updateProfileByUser :'/users/update-user',
  updateProfilePassword: '/users/update-password',
  //
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
  //box-detector-facility
  boxDetectorFacilityList: (siteId) =>`/box-detector-facility/${siteId}`,
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
  //Main dashboard
  mapInitialView:'/map/initial-view',
  mapDisplayPOI: '/map/poi',
  mapDisplayPOITest: '/map/poi-test',
  siteRoad:(filterParams) => `/site-road?${filterParams}`,
  //traffic event list
  trafficEventTime:(filterParams) => `/traffic-event-list/by-time?${filterParams}`,
  trafficEventRecent:(filterParams) => `/traffic-event-list/recent?${filterParams}`,
  //traffic event
  trafficEvent: (id) =>`/traffic-event/${id}`,
  //traffic event count
  trafficEventCnt: (filterParams)=>`/traffic-event-cnt?${filterParams}`,
  objectUnqCnt:(filterParams) => `/object-unq-cnt/vehicle/total?${filterParams}`,
  objectUnqCntRoad:(filterParams) => `/object-unq-cnt/road-vehicle?${filterParams}`,
  //Crossroad 
  siteRoadDetector: (id) =>`/site-road-detector/${id}`,
  //object unq cnt
  objectCntCompass:(filterParams) => `/object-unq-cnt/compass/total?${filterParams}`,
  objectCntCompassTime:(filterParams) => `/object-unq-cnt/compass/time-series?${filterParams}`,
  objectCntMovingDirectionTime:(filterParams) => `/object-unq-cnt/moving-direction/time-series?${filterParams}`,
  objectCntVehicleDirectionTime:(filterParams) => `/object-unq-cnt/vehicle-direction/time-series?${filterParams}`,
  objectCntDirectionTime:(filterParams) => `/object-unq-cnt/direction/time-series?${filterParams}`,
  //real time object position
  realTimeObject:(filterParams) => `/real-time-object?${filterParams}`,
  //Equipment Info 
  boxStatus: (id) =>`/box-status/${id}`,
  box: (id) =>`/box/${id}`,
  boxEvent: (id,filterParams) =>`/box-event/${id}?${filterParams}`,
  boxEventCnt: (id) =>`/box-event-cnt/${id}`,
  boxTempHum: (id, filterParams) =>`/box-temp-hum/${id}?${filterParams}`,
  boxCommand: (rtuID) =>`/box/${rtuID}/power/command`,
  mosCommand:  (siteID) =>`/site/${siteID}/mos/command`,
  //command
  command1:  (carId,filterParams) =>`/car/${carId}/command1?${filterParams}`,
  // `/car/1/command1?air=on&lights=on`
  command2:  (carId,filterParams) =>`/car/${carId}/command2?${filterParams}`,
  command3:  (carId,filterParams) =>`/car/${carId}/command3?${filterParams}`,
  command4:  (carId,filterParams) =>`/car/${carId}/command4?${filterParams}`,
}
