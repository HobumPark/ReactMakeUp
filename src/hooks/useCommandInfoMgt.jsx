
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCommand, fetchCommand } from "../api/command-info-mgt";
import NoticeMessage from "../plugin/noticemessage/noticemessage.js";
import { useTranslation } from "react-i18next";

const useCommandInfoMgt = ({
  commandQueryParams
}) => {
  const queryClient = useQueryClient();
  const {t} = useTranslation();

  //명령 조회
  const { data: command} = useQuery({
    queryKey: ["commandQueryParams",commandQueryParams],
    queryFn: () => fetchCommand(),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  //디바이스 다중 제어 (등록)
  // Mutation to create a user (POST request)
  const createMultiCommandMutation = useMutation({
    mutationFn: (commandList) => createCommand(commandList),
    onSuccess: (responseData) => {
      /*
      new NoticeMessage(t('msg > registration success'), {
        callback() {
          queryClient.invalidateQueries(["commandQueryParams", commandQueryParams]);
          onCreateSuccess(responseData);
        }
      */
      queryClient.invalidateQueries(["commandQueryParams", commandQueryParams]);
      //onCreateSuccess(responseData);
    },
    onError: (err) => {
      console.error("Error creating user:", err);
      new NoticeMessage(t(err.message))
    },
  });

  //하트비트 수집 에러 체크

  //데이터 저장

  return {
    createCommand:createMultiCommandMutation.mutate
  };
};

export default useCommandInfoMgt;