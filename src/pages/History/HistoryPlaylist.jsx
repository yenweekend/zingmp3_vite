import React, { useEffect, useState } from "react";
import HISTORY_KEY, { getHistory } from "../../helpers/history";
import { PlaylistHistory } from "../../components";
import { Empty } from "../../components";
import icons from "../../utils/icons";
const HistoryPlaylist = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const history = getHistory();
    setData(history[HISTORY_KEY.PLAYLIST]);
  }, []);
  return data?.length === 0 ? (
    <Empty
      noticeText={"Không có playlist nào gần đây"}
      icon={
        <icons.noteArt className="secondary-text text-[30px]"></icons.noteArt>
      }
    />
  ) : (
    <>
      <PlaylistHistory data={data} setData={setData}></PlaylistHistory>
    </>
  );
};

export default HistoryPlaylist;
