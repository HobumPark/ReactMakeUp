import React from "react";
import LogItem from "../LogItem/LogItem";

const LogList = ({logs}) => {

  return (
<div className="flex gap-4 items-center flex-nowrap ">
      {logs.map((log, index) => (
        <LogItem key={index} label={log.label} value={log.value} />
      ))}
    </div>
  );
};

export default LogList;
