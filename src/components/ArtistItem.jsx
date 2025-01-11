import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { convertNumber } from "../utils/constants";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Link } from "react-router-dom";
const ArtistItem = ({ data }) => {
  return (
    <div className=" flex w-full  items-center justify-start gap-2 py-2 px-[10px] search-item cursor-pointer relative">
      <div className="relative w-[52px] h-[52px] rounded-[50%] overflow-hidden ">
        <LazyLoadImage
          alt=""
          effect="blur"
          src={data.avatar || data.thumbnailM}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="title">
        <div className="text-[14px] font-medium ">{data.name}</div>
        <div className="text-[12px] opacity-40 flex items-center gap-[20px] relative">
          <div className="dot absolute w-[4px] h-[4px] rounded-full  top-[50%] left-[35%] translate-y-[-50%] "></div>
          <span>Nghệ sĩ</span>
          <span>
            {convertNumber(data.followers || data.totalFollow)} follower
          </span>
        </div>
      </div>
      <Link
        className="absolute inset-0 bg-transparent "
        to={`/nghe-si/${data.aliasName || data.alias}`}
      ></Link>
    </div>
  );
};

export default ArtistItem;
