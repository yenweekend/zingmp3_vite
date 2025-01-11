import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getZingChart } from "../apis/zing-api/home.api";
import { LineChart, SongList, Song } from "../components";
import moment from "moment";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import icons from "../utils/icons";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Loading } from "../components";

const Zingchart = () => {
  const [sliceEnd, setSlideEnd] = useState(false);
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["zingchart"],
    queryFn: getZingChart,
  });
  const suggestSong = useMemo(() => {
    if (data) {
      const rs =
        data.data.data.newRelease[
          Math.round(Math.random() * (data.data.data.newRelease.length - 1))
        ];
      return rs;
    }
  }, [data]);
  if (isPending) {
    return <Loading />;
  }
  if (isError) {
    return <span>Error: {error.message}</span>;
  }
  return (
    <WrappedZingchart>
      <LineChart
        data={data.data.data.RTChart}
        rank={false}
        fontsize={40}
        dimension={36}
        playbtn={26}
      ></LineChart>
      <div className="list-song">
        <div className="media  p-[10px] flex items-center group rounded-[4px] relative bor_b_1 ">
          <SongList song={suggestSong}>
            <div className="song_prefix w-[83px] flex items-center mr-[15px]  ">
              <span className="text-center secondary-text leading-[1.5] w-[83px]">
                Gợi ý
              </span>
            </div>
          </SongList>
        </div>
        {data.data.data.RTChart.items
          .slice(0, sliceEnd ? 100 : 10)
          .map((song, index) => (
            <div className="media  p-[10px] flex items-center group rounded-[4px] relative bor_b_1 ">
              <SongList song={song} key={song.encodeId}>
                <div className="song_prefix w-[83px] flex items-center mr-[15px]">
                  <span
                    className={` text-[32px] whitespace-nowrap font-black leading-[1] min-w-[43px] text-center w-[60px] mr-[5px] font-roboto ${
                      index == 0
                        ? "is_top_1"
                        : index == 1
                        ? "is_top_2"
                        : index == 2
                        ? "is_top_3"
                        : "stroke_primary"
                    }`}
                  >
                    {index + 1}
                  </span>
                  {song.rakingStatus == 0 ? (
                    <div className="primary-text flex flex-col items-center justify-center">
                      <icons.horizontal className="subtitle"></icons.horizontal>
                    </div>
                  ) : song.rakingStatus > 0 ? (
                    <div className="primary-text flex flex-col items-center justify-center">
                      <icons.arrowupfill className="text-[16px] text-[#1dc186]"></icons.arrowupfill>
                      <span className=" text-[14p]">{song.rakingStatus}</span>
                    </div>
                  ) : (
                    <div className="primary-text flex flex-col items-center justify-center">
                      <icons.arrowdownfill className="text-[20px] text-[#e35050]"></icons.arrowdownfill>
                      <span className=" text-[14p]">
                        {song.rakingStatus * -1}
                      </span>
                    </div>
                  )}
                </div>
              </SongList>
            </div>
          ))}
        <div className=" flex items-center justify-center">
          <button
            className="px-[25px] py-[8px] rounded-full leading-[1.43] text-[14px] cursor-pointer primary-text font-medium show-all mt-2 hover:translate-y-[-2px] transition-all ease-linear duration-150"
            onClick={() => {
              setSlideEnd((state) => !state);
            }}
          >
            {sliceEnd ? "Ẩn bớt" : "Xem Top 100"}
          </button>
        </div>
      </div>
      <div
        className={`mt-7 pt-10 relative max-1130:px-[29px]
        `}
      >
        <div
          className={`bg_blur absolute top-0 bottom-0 min-1120:left-[-60px] min-1120:right-[-60px] 
            left-[-29px] right-[-29px]
           z-[-1]`}
        ></div>
        <div
          className={`bg_alpha absolute top-0 bottom-0  z-[-1]  min-1120:left-[-60px] min-1120:right-[-60px] "
              left-[-29px] right-[-29px] 
          } `}
        ></div>
        <div className="  z-10">
          <div className="primary-text  text-[40px] font-bold title capitalize ">
            Bảng xếp hạng
          </div>
        </div>
        <div className="w-full flex-auto">
          <div className="">
            <div
              className={` min-1350:grid min-1350:grid-cols-3 min-1350:gap-x-[28px]  mb-[30px]
            py-5 px-[10px] z-10 rounded-[16px] flex flex-col gap-[28px] `}
            >
              <div className="alpha-bg rounded-2xl py-[20px]">
                <div className="country flex items-center gap-2 pl-10 pb-[10px]">
                  <p className=" text-[24px] font-bold primary-text ">
                    Việt Nam
                  </p>
                  <div className="w-[29px] h-[29px] flex items-center justify-center rounded-[50%] purple-bg cursor-pointer hover:opacity-80">
                    <icons.play className="text-white text-[12px]"></icons.play>
                  </div>
                </div>
                <div className=" ">
                  <div className="flex flex-col">
                    {data.data.data.weekChart.vn.items
                      .slice(0, 5)
                      .map((song, index) => (
                        <div className="px-[10px] group rounded-[4px] relative bor-b-1 ">
                          <Song
                            data={song}
                            key={song.encodeId}
                            dimension={40}
                            duration={true}
                          >
                            <div className="song_prefix flex items-center mr-[10px]">
                              <span
                                className={` text-[32px] whitespace-nowrap font-black leading-[1] min-w-[32px] text-center w-[32px]  ${
                                  index == 0
                                    ? "is_top_1"
                                    : index == 1
                                    ? "is_top_2"
                                    : index == 2
                                    ? "is_top_3"
                                    : "stroke_primary"
                                }`}
                              >
                                {index + 1}
                              </span>
                              {song.rakingStatus == 0 ? (
                                <div className="primary-text flex flex-col items-center justify-center">
                                  <icons.horizontal className="subtitle"></icons.horizontal>
                                </div>
                              ) : song.rakingStatus > 0 ? (
                                <div className="primary-text flex flex-col items-center justify-center">
                                  <icons.arrowupfill className="text-[16px] text-[#1dc186]"></icons.arrowupfill>
                                  <span className=" text-[14p]">
                                    {song.rakingStatus}
                                  </span>
                                </div>
                              ) : (
                                <div className="primary-text flex flex-col items-center justify-center">
                                  <icons.arrowdownfill className="text-[20px] text-[#e35050]"></icons.arrowdownfill>
                                  <span className=" text-[14p]">
                                    {song.rakingStatus * -1}
                                  </span>
                                </div>
                              )}
                            </div>
                          </Song>
                        </div>
                      ))}
                  </div>
                </div>
                <div className=" flex items-center justify-center mt-[15px]">
                  <Link
                    className="px-[25px] py-[8px] rounded-full leading-[1.43]text-[14px] cursor-pointer show-all font-normal primary-text hover:translate-y-[-2px] transition-all ease-linear duration-150"
                    // to={e.link.split(".")[0]}
                  >
                    Xem tất cả
                  </Link>
                </div>
              </div>
              <div className="alpha-bg rounded-2xl py-[20px]">
                <div className="country flex items-center gap-2 pl-10 pb-[10px]">
                  <p className=" text-[24px] font-bold primary-text ">US-UK</p>
                  <div className="w-[29px] h-[29px] flex items-center justify-center rounded-[50%] purple-bg cursor-pointer hover:opacity-80">
                    <icons.play className="text-white text-[12px]"></icons.play>
                  </div>
                </div>
                <div className=" ">
                  <div className="flex flex-col">
                    {data.data.data.weekChart.us.items
                      .slice(0, 5)
                      .map((song, index) => (
                        <div className="px-[10px] group rounded-[4px] relative bor-b-1 ">
                          <Song
                            data={song}
                            key={song.encodeId}
                            dimension={40}
                            duration={true}
                          >
                            <div className="song_prefix flex items-center mr-[10px]">
                              <span
                                className={` text-[32px] whitespace-nowrap font-black leading-[1] min-w-[32px] text-center w-[32px]  ${
                                  index == 0
                                    ? "is_top_1"
                                    : index == 1
                                    ? "is_top_2"
                                    : index == 2
                                    ? "is_top_3"
                                    : "stroke_primary"
                                }`}
                              >
                                {index + 1}
                              </span>
                              {song.rakingStatus == 0 ? (
                                <div className="primary-text flex flex-col items-center justify-center">
                                  <icons.horizontal className="subtitle"></icons.horizontal>
                                </div>
                              ) : song.rakingStatus > 0 ? (
                                <div className="primary-text flex flex-col items-center justify-center">
                                  <icons.arrowupfill className="text-[16px] text-[#1dc186]"></icons.arrowupfill>
                                  <span className=" text-[14p]">
                                    {song.rakingStatus}
                                  </span>
                                </div>
                              ) : (
                                <div className="primary-text flex flex-col items-center justify-center">
                                  <icons.arrowdownfill className="text-[20px] text-[#e35050]"></icons.arrowdownfill>
                                  <span className=" text-[14p]">
                                    {song.rakingStatus * -1}
                                  </span>
                                </div>
                              )}
                            </div>
                          </Song>
                        </div>
                      ))}
                  </div>
                </div>
                <div className=" flex items-center justify-center mt-[15px]">
                  <Link
                    className="px-[25px] py-[8px] rounded-full leading-[1.43]text-[14px] cursor-pointer show-all font-normal primary-text hover:translate-y-[-2px] transition-all ease-linear duration-150"
                    // to={e.link.split(".")[0]}
                  >
                    Xem tất cả
                  </Link>
                </div>
              </div>
              <div className="alpha-bg rounded-2xl py-[20px]">
                <div className="country flex items-center gap-2 pl-10 pb-[10px]">
                  <p className=" text-[24px] font-bold primary-text ">K-Pop</p>
                  <div className="w-[29px] h-[29px] flex items-center justify-center rounded-[50%] purple-bg cursor-pointer hover:opacity-80">
                    <icons.play className="text-white text-[12px]"></icons.play>
                  </div>
                </div>
                <div className=" ">
                  <div className="flex flex-col">
                    {data.data.data.weekChart.korea.items
                      .slice(0, 5)
                      .map((song, index) => (
                        <div className="px-[10px] group rounded-[4px] relative bor-b-1 ">
                          <Song
                            data={song}
                            key={song.encodeId}
                            dimension={40}
                            duration={true}
                          >
                            <div className="song_prefix flex items-center mr-[10px]">
                              <span
                                className={` text-[32px] whitespace-nowrap font-black leading-[1] min-w-[32px] text-center w-[32px]  ${
                                  index == 0
                                    ? "is_top_1"
                                    : index == 1
                                    ? "is_top_2"
                                    : index == 2
                                    ? "is_top_3"
                                    : "stroke_primary"
                                }`}
                              >
                                {index + 1}
                              </span>
                              {song.rakingStatus == 0 ? (
                                <div className="primary-text flex flex-col items-center justify-center">
                                  <icons.horizontal className="subtitle"></icons.horizontal>
                                </div>
                              ) : song.rakingStatus > 0 ? (
                                <div className="primary-text flex flex-col items-center justify-center">
                                  <icons.arrowupfill className="text-[16px] text-[#1dc186]"></icons.arrowupfill>
                                  <span className=" text-[14p]">
                                    {song.rakingStatus}
                                  </span>
                                </div>
                              ) : (
                                <div className="primary-text flex flex-col items-center justify-center">
                                  <icons.arrowdownfill className="text-[20px] text-[#e35050]"></icons.arrowdownfill>
                                  <span className=" text-[14p]">
                                    {song.rakingStatus * -1}
                                  </span>
                                </div>
                              )}
                            </div>
                          </Song>
                        </div>
                      ))}
                  </div>
                </div>
                <div className=" flex items-center justify-center mt-[15px]">
                  <Link
                    className="px-[25px] py-[8px] rounded-full leading-[1.43]text-[14px] cursor-pointer show-all font-normal primary-text hover:translate-y-[-2px] transition-all ease-linear duration-150"
                    // to={e.link.split(".")[0]}
                  >
                    Xem tất cả
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WrappedZingchart>
  );
};
const WrappedZingchart = styled.div`
  .bg_blur {
    background: url(https://zjs.zmdcdn.me/zmp3-desktop/releases/v1.9.109/static/media/week-chart-bg.edf332e5.jpg)
      top/cover no-repeat;
    filter: grayscale(1);
    display: var(--bg_blur);
  }
  .bg_alpha {
    display: var(--bg_blur);
    background-color: var(--chart-bg-img-alpha);
  }
`;
export default Zingchart;
