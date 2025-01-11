import React, { useEffect, useState } from "react";
import HISTORY_KEY, { getHistory } from "../../helpers/history";
import { SongList } from "../../components";
import icons from "../../utils/icons";
import { Empty } from "../../components";
const HistorySong = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const prevHistory = getHistory();
    setData(prevHistory[HISTORY_KEY.SONG]);
  }, []);
  return data?.length === 0 ? (
    <Empty
      noticeText={"Không có bài hát nào gần đây"}
      icon={
        <icons.noteArt className="secondary-text text-[30px]"></icons.noteArt>
      }
    />
  ) : (
    <>
      {data?.map((song) => (
        <div
          className=" flex justify-between items-center h-[60px] group  relative cursor-pointer song-info  rounded p-[10px] song-list "
          key={song.encodeId}
        >
          <SongList song={song} isDelete={true} setData={setData}></SongList>
        </div>
      ))}
    </>
  );
};

export default HistorySong;
