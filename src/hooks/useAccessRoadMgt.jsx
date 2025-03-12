import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

import { URLS, APIS } from "../config/urls.js";
import { reqGet, reqPost, reqPut } from "../utils/request.js";
import NoticeMessage from "../plugin/noticemessage/noticemessage.js";
import { fetchTrafficEvent, fetchTrafficEventTime } from "../api/dashboard";

const useAccessRoadMgt = ( {trafficEventParams}  ) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: trafficEventTime  } = useQuery({
        queryKey: ["trafficEventTime", trafficEventParams],
        queryFn: () => fetchTrafficEventTime(trafficEventParams),
        staleTime: 1000 * 60 * 1,
    });

    const { data: trafficEvent } = useQuery({
    queryKey: ["trafficEvent", id],
    queryFn: () => fetchTrafficEvent(id),
        retry: false, 
        enabled: !!id,
        staleTime: 1000 * 60 * 1,
        onError: () => {
        },
    });

  return {
    trafficEventTime
  };
};

export default useAccessRoadMgt;
