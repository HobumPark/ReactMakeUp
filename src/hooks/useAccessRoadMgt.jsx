import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

import { URLS, APIS } from "../config/urls.js";
import { reqGet, reqPost, reqPut } from "../utils/request.js";
import NoticeMessage from "../plugin/noticemessage/noticemessage.js";
import { fetchTrafficEvent, fetchTrafficEventTime } from "../api/dashboard";
import { fetchObjectUnqCnt} from "../api/dashboard";

const useAccessRoadMgt = ( {objectUnqCntPie1Params,objectUnqCntPie2Params,
  objectUnqCntTable1TodayParams,objectUnqCntTable1YesterdayParams,objectUnqCntTable1OneWeekParams,
  objectUnqCntTable2TodayParams,objectUnqCntTable2YesterdayParams,objectUnqCntTable2OneWeekParams
}  ) => {
  const queryClient = useQueryClient();

  //파이차트1
  const { data: objectUnqCntPie1} = useQuery({
    queryKey: ["objectUnqCntPieParams1", objectUnqCntPie1Params],
    queryFn: () => fetchObjectUnqCnt(objectUnqCntPie1Params),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    enabled: !!objectUnqCntPie1Params
  });

  //파이차트2
  const { data: objectUnqCntPie2} = useQuery({
    queryKey: ["objectUnqCntPieParams2", objectUnqCntPie2Params],
    queryFn: () => fetchObjectUnqCnt(objectUnqCntPie2Params),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    enabled: !!objectUnqCntPie2Params
  });

  //테이블1
  const { data: objectUnqCntTable1Today} = useQuery({
    queryKey: ["objectUnqCntTable1TodayParams", objectUnqCntTable1TodayParams],
    queryFn: () => fetchObjectUnqCnt(objectUnqCntTable1TodayParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    enabled: !!objectUnqCntTable1TodayParams
  });
  const { data: objectUnqCntTable1Yesterday} = useQuery({
    queryKey: ["objectUnqCntTable1YesterdayParams", objectUnqCntTable1YesterdayParams],
    queryFn: () => fetchObjectUnqCnt(objectUnqCntTable1YesterdayParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    enabled: !!objectUnqCntTable1YesterdayParams
  });
  const { data: objectUnqCntTable1OneWeek} = useQuery({
    queryKey: ["objectUnqCntTable1OneWeekParams", objectUnqCntTable1OneWeekParams],
    queryFn: () => fetchObjectUnqCnt(objectUnqCntTable1OneWeekParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    enabled: !!objectUnqCntTable1OneWeekParams
  });
  //테이블2
  const { data: objectUnqCntTable2Today} = useQuery({
    queryKey: ["objectUnqCntTable2TodayParams", objectUnqCntTable2TodayParams],
    queryFn: () => fetchObjectUnqCnt(objectUnqCntTable2TodayParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    enabled: !!objectUnqCntTable2TodayParams
  });
  const { data: objectUnqCntTable2Yesterday} = useQuery({
    queryKey: ["objectUnqCntTable1YesterdayParams", objectUnqCntTable2YesterdayParams],
    queryFn: () => fetchObjectUnqCnt(objectUnqCntTable2YesterdayParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    enabled: !!objectUnqCntTable2YesterdayParams
  });
  const { data: objectUnqCntTable2OneWeek} = useQuery({
    queryKey: ["objectUnqCntTable1OneWeekParams", objectUnqCntTable2OneWeekParams],
    queryFn: () => fetchObjectUnqCnt(objectUnqCntTable2OneWeekParams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    enabled: !!objectUnqCntTable2OneWeekParams
  });

  return {
    objectUnqCntPie1,
    objectUnqCntPie2,
    objectUnqCntTable1Today,
    objectUnqCntTable1Yesterday,
    objectUnqCntTable1OneWeek,
    objectUnqCntTable2Today,
    objectUnqCntTable2Yesterday,
    objectUnqCntTable2OneWeek
  };
};

export default useAccessRoadMgt;
