import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import SingerName from "./SingerName";
import icons from "../utils/icons";
import timeToString from "../helpers/timeToString";
const SongSocial = ({ data, index }) => {
  return (
    <div className="w-full p-[15px] new-release-slide flex  gap-3">
      <div className="w-[120px] h-[120px] overflow-hidden flex-shrink-0 rounded-lg relative group">
        <LazyLoadImage
          effect="blur"
          src={data.thumbnailM}
          className="w-full h-full object-cover group-hover:scale-125 transition duration-300 ease-in-out"
        ></LazyLoadImage>
        <div className="absolute inset-0 dark-alpha-50 invisible group-hover:visible transition-all ease-linear duration-300">
          <button className="button absolute center w-[50px] h-[50px] rounded-full primary-text border border-white flex items-center justify-center">
            <icons.play className="text-[--white]"></icons.play>
          </button>
        </div>
      </div>
      <div className="flex flex-col justify-between flex-1 ">
        <div className="primary-text">
          <h3 className="text-inherit text-[14px]">{data.title}</h3>
          <SingerName artists={data.artists} clamp={2}></SingerName>
        </div>
        <div className="top flex  justify-between items-end">
          <span className="order">#{index + 1}</span>
          <span className="secondary-text text-[14px]">
            {timeToString(data.releasedAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SongSocial;
