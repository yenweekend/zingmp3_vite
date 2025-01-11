import React from "react";
import icons from "../utils/icons";
import styled from "styled-components";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useQuery } from "@tanstack/react-query";
import { getSinger } from "../apis/zing-api/singer.api";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { CollectPlaylistBtn, CollectSongBtn } from "../components";
import { Loading } from "../components";

import { Song, Playlist, VideoList } from "../components";
const SingerProfile = () => {
  const { singer } = useParams();
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["singer", singer],
    queryFn: () => getSinger(singer),
    enabled: !!singer,
  });
  if (isPending) {
    return <Loading />;
  }
  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <>
      <WrappedSingerProfile>
        <div className=" artist_hero ">
          <div
            className={`blur_container 
              min-1130:mx-[-60px] mx-[-29px]
            `}
            // ref={topRef}
          >
            <div className="">
              <div
                className={`bg_blur `}
                style={{
                  backgroundImage: `url(${data.data.data.thumbnailM})`,
                }}
              ></div>
              <div className="bg_alpha"></div>
            </div>
          </div>
          <div className="hero_body flex  z-[10] pb-6">
            <div className="relative w-[140px] h-[140px] rounded-[50%] mr-8 overflow-hidden">
              <LazyLoadImage
                alt=""
                src={data.data.data.thumbnailM}
                className="w-full h-full object-cover"
                effect="blur"
              />
            </div>
            <div className="content flex flex-col justify-start">
              <div className="content_header flex items-center mb-4">
                <h3 className="text-[60px] font-bold w-fit title artist_name ">
                  {data.data.data.name}
                </h3>
                <div className="h-[52px] w-[52px] rounded-[50%] bg-primary flex items-center justify-center zm_btn ml-5">
                  <icons.play className="text-[24px] w-6 h-6 ml-[5px]"></icons.play>
                </div>
              </div>
              <div className="media flex items-center">
                <span className="text-[14px] follower font-medium mr-6">
                  {`${Math.floor(
                    data.data.data?.totalFollow / 1000
                  )}K  Người quan tâm`}
                </span>
                <button className="add_follow_btn flex items-center gap-1">
                  <div className="h-4 w-4 flex items-center justify-center">
                    <icons.add className="text-inherit text-[16px]"></icons.add>
                  </div>
                  <span className="uppercase text-[12px] text-inherit">
                    quan tâm
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        {data.data.data.sections.map((item) =>
          item.sectionType === "song" ? (
            <div className="flex items-center">
              {data.data.data?.topAlbum && (
                <>
                  <div className="grow-0 shrink-0 basis-[33.333%]  mr-7">
                    <h3 className="section_title mb-5 text-[20px] font-bold capitalize">
                      Mới phát hành
                    </h3>
                    <div
                      className="cursor-pointer rounded-[12px] relative"
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(data.data.data?.topAlbum?.link.split(".")[0]);
                      }}
                    >
                      <div className="p-4 rounded-[12px] flex items-start relative z-[2] max-1280:flex-col">
                        <div className="w-[151px] h-[151px] shrink-0 rounded-[8px]  group cursor-pointer relative">
                          <div className="section_link inline-block absolute inset-0  ">
                            <div className="img absolute inset-0 rounded-[8px] overflow-hidden  shrink-0">
                              <LazyLoadImage
                                alt=""
                                src={data.data.data?.topAlbum.thumbnailM}
                                className=" w-full h-full object-cover group-hover:scale-125 transition duration-700 ease-in-out"
                                effect="opacity"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="ml-4 my-[6px] flex flex-col info_release_song">
                          <span className=" secondary-text text-[12px] ">
                            {data.data.data?.topAlbum?.textType}
                          </span>
                          <h3 className="text-[14px] font-semibold pt-3 pb-[2px] primary-text">
                            {data.data.data?.topAlbum?.title}
                          </h3>
                          <span className="secondary-text text-[12px]  pb-3 ">
                            {data.data.data?.topAlbum?.artistsNames}
                          </span>
                          <span className=" secondary-text text-[12px] ">
                            {data.data.data?.topAlbum?.releaseDate}
                          </span>
                        </div>
                      </div>
                      <div className="media_blur">
                        <div className="cover_bg"></div>
                        <div className="gradient_layer"></div>
                        <div className="blur_layer"></div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div
                className={`
               w-[66.666%]
             my-[30px]  grow flex  flex-col`}
              >
                <div className="section_header w-full flex justify-between mb-5">
                  <h3 className="section_title  ">Bài Hát Nổi Bật</h3>
                  <div className="section_discovery flex items-center">
                    <Link className="text-[16px] discovery_btn">
                      Tất cả
                      <icons.arrowRight className="text-[16px] ml-[6px]"></icons.arrowRight>
                    </Link>
                  </div>
                </div>
                <div className="w-full">
                  <div
                    className=" ml-[-28px] grid min-1220:grid-cols-2  "
                    style={{
                      gridTemplateRows: `repeat(3, minmax(0, 1fr))`,
                    }}
                  >
                    {data.data.data?.sections
                      ?.find((e) => e.sectionType == "song")
                      ["items"].slice(0, 6)
                      .map((e) => (
                        <div
                          className={`song_item  feature-song
                         flex items-center   rounded-[6px] justify-between  `}
                          key={e.encodeId}
                        >
                          <Song duration={true} data={e} dimension={40}></Song>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ) : item.sectionType === "playlist" ? (
            <Playlist data={item.items} title={item.title}></Playlist>
          ) : item.sectionType === "video" ? (
            <VideoList data={item.items} title={item.title}></VideoList>
          ) : (
            ""
          )
        )}
        {data.data.data?.biography && data.data.data?.biography.length > 0 && (
          <div className="mt-[48px]">
            <div className="text-[20px] font-bold mb-5  primary-text">
              Về {data.data.data?.name}
            </div>
            <div className="content flex items-start mr-[280px]">
              <div className="w-[calc(50%)] h-auto rounded-[12px] overflow-hidden mr-[30px] relative">
                <div className=" w-full  relative pb-[68%] ">
                  <LazyLoadImage
                    alt=""
                    src={data.data.data?.thumbnailM}
                    className="w-full h-full object-cover absolute image_singer"
                  />
                </div>
              </div>
              <div className="text w-0 flex flex-auto flex-col">
                <div className="history_paragh ">
                  {data.data.data?.biography.split("<br>").map((e, index) => (
                    <span key={index}>
                      {e}
                      <br></br>
                    </span>
                  ))}
                  <span className="watch_more">Xem thêm</span>
                </div>
                <div className="text-[20px] leading-[24px] font-bold primary-text mb-[4px] capitalize">
                  {data.data.data?.totalFollow.toLocaleString()}
                </div>
                <div className="secondary-text text-[20px]">người quan tâm</div>
              </div>
            </div>
          </div>
        )}
      </WrappedSingerProfile>
    </>
  );
};
const WrappedSingerProfile = styled.div`
  margin-bottom: 30px;
  .watch_more {
    display: inline-block;
    color: var(--text-item-hover);
    font-size: 12px;
    font-weight: 700;
    line-height: 1.92;
    cursor: pointer;
    text-transform: uppercase;
  }
  .history_paragh {
    font-size: 14px;
    font-weight: 400;
    color: var(--text-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    -webkit-line-clamp: 7;
    white-space: normal;
    margin-bottom: 48px;
  }
  .image_singer {
    object-position: 50% 20%;
  }
  .title {
    color: var(--text-primary);
  }
  .artist_hero {
    --linear-gradient: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0) 50%,
      rgba(48, 47, 64, 0.8)
    );
    position: relative;
    margin: 0 0 30px;
    padding-top: 135px;
    display: flex;
    align-items: flex-end;
  }
  .blur_container {
    inset: 0;
    overflow: hidden;
    position: absolute;
    overflow: hidden;
  }
  .bg_blur {
    height: 100%;
    background-repeat: no-repeat;
    background-position: 50% center;
    background-size: cover;
    filter: blur(50px);
    position: absolute;
    inset: 0;
    display: block;
  }
  .bg_alpha {
    /* background-color: var(--artist-layout-bg); */
    z-index: 3;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: block;
  }
  .artist_name {
    line-height: normal;
  }
  .zm_btn {
    background-color: var(--purple-primary);
    border-color: var(--purple-primary);
    color: var(--white);
  }
  .follower {
    color: var(--text-primary);
  }
  .add_follow_btn {
    border-radius: 100px;
    background: transparent;
    border: 1px solid var(--border-primary);
    color: var(--text-primary);
    height: 28px;
    padding: 4px 24px;
    font-size: 12px;
  }
  .section_title {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
  }
  .discovery_btn {
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    color: var(--text-secondary);
  }
  .text_zm {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    letter-spacing: 0.0025em;
    text-transform: capitalize;
    color: var(--secondary-text-color);
  }
  .name_song {
    line-height: 18px;
    letter-spacing: 0.0025em;
    text-transform: capitalize;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    white-space: normal;
    color: var(--primary-text-color);
  }
  .media_blur {
    z-index: 1;
    overflow: hidden;
    border-radius: 12px;
    position: absolute;
    inset: 0;
  }
  .cover_bg {
    background-image: url(https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_jpeg/cover/a/5/1/e/a51e1381fc3ade96b2c146e98587c77d.jpg);
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: cover;
    border-radius: 16px;
    position: absolute;
    inset: 0;
  }
  .gradient_layer {
    background: var(--gradient-latest-section-artist);
    position: absolute;
    inset: 0;
  }
  .blur_layer {
    background-color: var(--blur-layer-color);
    -webkit-backdrop-filter: blur(25px);
    backdrop-filter: blur(25px);
    position: absolute;
    inset: 0;
  }
  .artistnames {
    line-height: 1.33;
    color: var(--text-secondary);
  }
  .artistnames > span:hover {
    color: var(--link-text-hover);
    text-decoration: underline;
    text-decoration-thickness: 0.3px;
  }
  .text_sc {
    color: var(--text-secondary);
  }
  .song_item {
    border-bottom: 1px solid var(--border-secondary);
    border-radius: 4px;
  }
  .wrap_video {
    padding-bottom: 56.25%;
    overflow: hidden;
    border-radius: 4px;
    position: relative;
  }
  video {
    position: absolute;
    width: 100%;
    height: 100%;
  }
`;
export default SingerProfile;
