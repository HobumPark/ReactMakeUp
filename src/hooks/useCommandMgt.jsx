
import { useQuery, useQueryClient } from "@tanstack/react-query";  
import { fetchCommand1,fetchCommand2,fetchCommand3,fetchCommand4 } from "../api/command-mgt";

const useCommandMgt = ({
  command1CarId="",
  command2CarId="",
  command3CarId="",
  command4CarId="",
  command1QueryPrams="",
  command2QueryPrams="",
  command3QueryPrams="",
  command4QueryPrams="",
}) => {
  const queryClient = useQueryClient();

  const { data: command1Data} = useQuery({
    queryKey: ["command1QueryPrams",command1CarId, command1QueryPrams],
    queryFn: () => fetchCommand1(command1CarId,command1QueryPrams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  const { data: command2Data} = useQuery({
    queryKey: ["command2QueryPrams",command2CarId, command2QueryPrams],
    queryFn: () => fetchCommand2(command2CarId,command2QueryPrams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  const { data: command3Data} = useQuery({
    queryKey: ["command3QueryPrams",command3CarId, command3QueryPrams],
    queryFn: () => fetchCommand3(command3CarId,command3QueryPrams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  const { data: command4Data} = useQuery({
    queryKey: ["command4QueryPrams",command4CarId, command4QueryPrams],
    queryFn: () => fetchCommand4(command4CarId,command4QueryPrams),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  return {
    command1Data,
    command2Data,
    command3Data,
    command4Data
  };
};

export default useCommandMgt;