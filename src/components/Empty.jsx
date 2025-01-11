import React from "react";
import icons from "../utils/icons";
const Empty = ({ noticeText, icon }) => {
  return (
    <div className="h-[220px] alpha-bg rounded-md flex items-center justify-center flex-col">
      {icon}
      <span className="secondary-text text-[20px] font-medium">
        {noticeText}
      </span>
    </div>
  );
};

export default Empty;
