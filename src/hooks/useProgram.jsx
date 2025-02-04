import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, deleteUser, fetchDetailUser, fetchUserList, updateUser } from "../api/user-mgt";
import NoticeMessage from "../plugin/noticemessage/noticemessage";
import { assignData, fetchGroupPrograms, fetchProgramAuthenticated, fetchUpperProgram } from "../api/program";

const useProgram = ({
  id = null,
  queryParams =  "",
  onDeleteSuccess = () => {},
  onCreateSuccess = () => {},
  onUpdateSuccess = () => {},
}) => {
  const queryClient = useQueryClient();

  const { data: programAuthenticated } = useQuery({
    queryKey: ["programAuthenticated", queryParams],
    queryFn: () => fetchProgramAuthenticated(queryParams),
    staleTime: 1000 * 60 * 1,
  });

  const { data: upperProgram } = useQuery({
    queryKey: ["upperProgram"],
    queryFn: () => fetchUpperProgram(),
    staleTime: 1000 * 60 * 1,
  });

  const { data: groupProgramsData} = useQuery({
    queryKey: ["groupProgramsData", id],
    queryFn: () => fetchGroupPrograms(id),
    retry: false, 
    enabled: !!id,
    onError: () => {
    },
  });

  const assignAuthorityMutation = useMutation({
    mutationFn: (codeData) => assignData(id,codeData),
    onSuccess: (responseData) => {
        new NoticeMessage(`Data is succesfully registered.`, {
            callback() {
              queryClient.invalidateQueries(["groupProgramsData", id]);
              onCreateSuccess(responseData);
            }
          });
    },
    onError: (err) => {
        console.error("Error creating:", err);
        new NoticeMessage(`${err.message}`)
    },
   });    


  return {
    programAuthenticated,
    upperProgram, 
    groupProgramsData,
    assignAuthority: assignAuthorityMutation.mutate
  };
};

export default useProgram;
