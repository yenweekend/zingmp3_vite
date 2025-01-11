import React, { useEffect, useState } from "react";
import { getHistory } from "../../helpers/history";
import HISTORY_KEY from "../../helpers/history";
import { VideoList } from "../../components";
import { Empty } from "../../components";
import icons from "../../utils/icons";
const HistoryMV = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const history = getHistory();
    setData(history[HISTORY_KEY.MV]);
  }, []);
  return data?.length === 0 ? (
    <Empty
      noticeText={"Không có MV nào gần đây"}
      icon={
        <icons.noteArt className="secondary-text text-[30px]"></icons.noteArt>
      }
    />
  ) : (
    <>
      <VideoList
        data={data}
        header={false}
        setData={setData}
        isDeleteHistory={true}
        wrap={true}
      />
    </>
  );
};

export default HistoryMV;
