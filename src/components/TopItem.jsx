import React, { useRef, useState } from "react";
import SingerName from "./SingerName";
import icons from "../utils/icons";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Link } from "react-router-dom";

const TopItem = ({ dimension, fontSize, data, objectType = "song" }) => {
  return (
    <div className=" flex  items-center  group  relative cursor-pointer  rounded p-[10px]  w-full song-info ">
      <div className="flex items-center  w-[50%] flex-shrink flex-grow ">
        <div
          className={`${
            objectType === "song" ? "rounded-full" : "rounded-xl"
          } overflow-hidden relative flex-shrink-0`}
          style={{
            width: `${dimension}px`,
            height: `${dimension}px`,
          }}
        >
          <LazyLoadImage
            alt=""
            effect="blur"
            src={data.thumbnailM}
            className="w-full h-full object-cover "
          />
          <div className="absolute  inset-0 flex items-center justify-center invisible group-hover:visible cursor-pointer dark-alpha-50">
            <icons.shuffle className="icon_btn text-[24px] text-white"></icons.shuffle>
          </div>
        </div>
        <div className=" ml-3 w-[100%]">
          <span className="secondary-text text-[12px]">
            {objectType === "song" ? "Nghệ sĩ" : "Thể loại"}
          </span>
          <div
            className={`max-w-[100%] text-[14px]  flex items-center  }`}
            style={{
              fontSize: `${fontSize}px`,
            }}
          >
            {objectType === "song" ? (
              <Link
                to={`/nghe-si/${data.alias}`}
                className={` w-0 flex-auto  line-clamp-1  primary-text  subtitle font-bold`}
              >
                {data.name}
              </Link>
            ) : (
              <Link
                to={data.link.split(".")[0]}
                className={` w-0 flex-auto  line-clamp-1  primary-text  subtitle font-bold`}
              >
                {data.title}
              </Link>
            )}
          </div>
          {objectType === "song" && (
            <h3 className="secondary-text text-[12px]">2.5M quan taam</h3>
          )}
        </div>
      </div>
    </div>
  );
};
export default TopItem;
