import React from "react";
import icons from "../utils/icons";
import { LazyLoadImage } from "react-lazy-load-image-component";
import SingerName from "./SingerName";
import { Link } from "react-router-dom";

import HISTORY_KEY, { addToHistory } from "../helpers/history";
import CollectPlaylistBtn from "./CollectPlaylistBtn";
import ViewMorePlaylistBtn from "./ViewMorePlaylistBtn";
const PlaylistItem = ({ playlistData }) => {
  const handleAddToHistory = (event) => {
    event.stopPropagation();
    addToHistory(HISTORY_KEY.PLAYLIST, playlistData);
  };
  return (
    <div className="w-full">
      <div className=" pt-[100%]  relative rounded-xl group cursor-pointer  ">
        <div className="section_link inline-block absolute inset-0  ">
          <div className="img absolute inset-0 rounded  overflow-hidden">
            <LazyLoadImage
              alt=""
              effect="blur"
              src={playlistData.thumbnailM}
              className=" w-full h-full object-cover group-hover:scale-125  transition-transform  ease-linear duration-700"
            />
          </div>
        </div>
        <Link
          to={playlistData.link.split(".")[0]}
          className={` absolute inset-0  dark-alpha-50 rounded  group-hover:visible invisible 
                `}
          onClick={(event) => {
            event.stopPropagation();
            handleAddToHistory(event);
          }}
        ></Link>
        <div className="absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] items-center justify-center flex  group-hover:visible invisible gap-[8px]">
          <CollectPlaylistBtn playlistData={playlistData} />
          <div className=" text-white flex items-center justify-center w-10 h-10 border border-solid border-white rounded-[50%] cursor-pointer  ">
            <icons.playsharp className="text-[26px] text-[--white]"></icons.playsharp>
          </div>
          <ViewMorePlaylistBtn playlistData={playlistData} />
        </div>
      </div>
      <div className="  font-bold text-[14px] mt-[12px] cursor-pointer secondary-text">
        <div className="flex items-center mb-[4px] ">
          <Link
            to={playlistData.link.split(".")[0]}
            className="w-0 flex-auto line-clamp-2 primary-text text-[14px] font-semibold title-link"
          >
            {playlistData.title}
          </Link>
        </div>
        <SingerName clamp={2} artists={playlistData.artists}></SingerName>
      </div>
    </div>
  );
};

export default PlaylistItem;
