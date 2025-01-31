import React from "react";

const LogItem = ({ label, value }) => {
  return (
    <div className="flex flex-row items-center gap-2 whitespace-nowrap  pr-2.5 pl-0">
      <span className="text-[14px] text-neutral-400 font-normal">{label}</span>
      <span className="text-[14px] font-medium">{value}</span>
    </div>
  );
};

export default LogItem;
