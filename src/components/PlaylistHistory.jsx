import React, { useEffect, useState } from "react";

import "react-lazy-load-image-component/src/effects/blur.css";
import PlaylistHistoryItem from "./PlaylistHistoryItem";
const PlaylistHistory = ({ data, setData }) => {
  return (
    <div className=" mt-12 w-full flex-auto">
      <div className="w-full">
        <div
          className={` flex flex-wrap ml-[-28px] overflow-hidden gap-y-[28px]`}
        >
          {data?.map((e) => (
            <div
              className={` ml-[28px]  min-1130:w-[calc((100%/5)-28px)]  w-[calc((100%/4)-28px)] flex-shrink-0`}
              key={e?.encodeId}
            >
              <PlaylistHistoryItem
                playlistData={e}
                setPlaylistData={setData}
              ></PlaylistHistoryItem>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaylistHistory;
