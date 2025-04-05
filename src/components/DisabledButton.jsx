import React from "react";
import { Loader2 } from "lucide-react";
const DisabledButton = () => {
  return (
    <div className="text-[#fff] flex items-center gap-2 text-[14px] font-bold">
      Vui lòng chờ
      <Loader2 className="animate-spin" strokeWidth={2} />
    </div>
  );
};

export default DisabledButton;
