import React from "react";
import { playlist } from "../fakeData/index";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import icons from "../utils/icons";
import { Link } from "react-router-dom";
import { Popover } from "antd";
import SingerName from "./SingerName";
const HistoryPlaylist = () => {
  return (
    <div className=" mt-12 w-full flex-auto">
      <div className="section_header w-full flex justify-between mb-5">
        <h3 className="text-[20px] font-bold capitalize leading-[1.5] primary-text ">
          Nghe gần đây
        </h3>
        <div className=" flex items-center">
          <Link className="  text-[12px] font-medium uppercase " to={"/"}>
            Tất cả
          </Link>
          <icons.arrowRight className=" section_discovery_icon  text-[16px] ml-1"></icons.arrowRight>
        </div>
      </div>
      <div className="w-full">
        <div className=" flex flex-nowrap ml-[-28px] overflow-hidden">
          {playlist?.map((e) => (
            <div
              className={` ml-[28px]  min-1350:w-[calc((100%/7)-28px)]  
               min-1220:w-[calc((100%/6)-28px)] w-[calc((100%/5)-28px)]  flex-shrink-0`}
              key={e?.encodeId}
            >
              <div
                className=" pt-[100%]  relative rounded-xl group cursor-pointer  "
                // onClick={(event) => {
                //   event.stopPropagation();
                //   navigate(e?.link?.split(".")[0], {
                //     state: { play: false },
                //   });
                // }}
              >
                <div className="section_link inline-block absolute inset-0  ">
                  <div className="img absolute inset-0 rounded  overflow-hidden">
                    <LazyLoadImage
                      alt=""
                      effect="blur"
                      src={e?.thumbnailM}
                      className=" w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-in-out"
                    />
                  </div>
                </div>
                <div
                  className={`options absolute inset-0 items-center justify-center flex 
                       group-hover:visible invisible dark-alpha-50 rounded `}
                >
                  <Popover
                    title="Thêm vào thư viện"
                    trigger="hover"
                    color="#363636"
                  >
                    <div
                      className={`heat  flex items-center justify-center w-8 h-8  cursor-pointer hover:bg-white hover:bg-opacity-25 rounded-[50%] mx-2 group/visible relative `}
                    >
                      <icons.heart className="text-[16px] primary-text"></icons.heart>
                    </div>
                  </Popover>

                  <div className=" text-white flex items-center justify-center w-10 h-10 border border-solid border-white rounded-[50%] cursor-pointer  ">
                    <icons.playsharp className="text-[26px] primary-text"></icons.playsharp>
                  </div>
                  <Popover title="Xem thêm" trigger="hover" color="#363636">
                    <div className="  flex items-center justify-center w-8 h-8  cursor-pointer hover:bg-white hover:bg-opacity-25 rounded-[50%] mx-2 group/visible relative ">
                      <icons.more className="text-[20px] primary-text"></icons.more>
                    </div>
                  </Popover>
                </div>
              </div>
              <div className="  font-bold text-[14px] mt-[12px] cursor-pointer secondary-text">
                {e?.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryPlaylist;
