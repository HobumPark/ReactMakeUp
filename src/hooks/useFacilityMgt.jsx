import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import NoticeMessage from "../plugin/noticemessage/noticemessage";
import { createFacility, deleteFacility, fetchDetailFacility, fetchFacilityList, updateFacility } from "../api/facility-mgt";
import { useTranslation } from "react-i18next";


const useFacilityMgt = ({
  fcID = null,
  queryParams =  "",
  onDeleteSuccess = () => {},
  onCreateSuccess = () => {},
  onUpdateSuccess = () => {},
}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data: facilityListData } = useQuery({
    queryKey: ["facilityListData", queryParams],
    queryFn: () => fetchFacilityList(queryParams),
    staleTime: 1000 * 60 * 1,
  });


  const { data: detailFacilityData} = useQuery({
    queryKey: ["detailFacilityData", fcID],
    queryFn: () => fetchDetailFacility(fcID),
    retry: false, 
    enabled: !!fcID,
    onError: () => {
    },
  });


  const createFacilityMutation = useMutation({
    mutationFn: (facilityData) => createFacility(facilityData),
    onSuccess: (responseData) => {
      new NoticeMessage(t('msg > registration success'), {
        callback() {
          queryClient.invalidateQueries(["facilityListData", queryParams]);
          onCreateSuccess(responseData.data);
        }
      });
      },
    onError: (err) => {
      new NoticeMessage(err.message)
      },
  });

  const deleteFacilityMutation = useMutation({
    mutationFn: (fcID) => deleteFacility(fcID),
    onSuccess: () => {
      new NoticeMessage(t('msg > delete success'), {
        callback() {
          onDeleteSuccess();
          queryClient.invalidateQueries(["facilityListData", queryParams]);
        }
      });
    },
    onError: (err) => {
      new NoticeMessage(err.message)
      },
    });

  const updateFacilityMutation = useMutation({
    mutationFn: (facilityData) => updateFacility(facilityData),
    onSuccess: (responseData) => {
      new NoticeMessage(t('msg > update success'), {
        callback() {
          queryClient.invalidateQueries(["facilityListData", queryParams]);
          onUpdateSuccess(responseData.data);
            
        }
      });
    },
    onError: (err) => {
      new NoticeMessage(err.message)
      },
  });

  return {
    facilityListData,
    detailFacilityData,
    createFacility: createFacilityMutation.mutate,
    updateFacility: updateFacilityMutation.mutate,
    deleteFacility: deleteFacilityMutation.mutate
  };
};

export default useFacilityMgt;
