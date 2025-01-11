import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import moment from "moment";
import { Icons } from "react-toastify";
import icons from "../utils/icons";
import { SingerName } from "../components";
import { Popover } from "antd";
import Modal from "../components/Modals/Modal";
import RightSideBar from "./RightSideBar";
import {
  queueSongSelector,
  currentIdSelector,
} from "../redux/queueSong/selector";
import { useSelector } from "react-redux";
const PlayerBar = () => {
  const queueSong = useSelector(queueSongSelector);
  const currentId = useSelector(currentIdSelector);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isAppear, setIsAppear] = useState(false);
  const viewRef = useRef(null);
  const audioRef = useRef();
  const progressRef = useRef();
  const progressFillRef = useRef();
  const curtimeRef = useRef();
  const progressVolFill = useRef();
  const progressVol = useRef();
  const draggbleProgress = useCallback((e) => {
    const progressRect = progressRef.current.getBoundingClientRect();
    const mouseX = e.clientX - progressRect.left;
    const timeLineWidth = progressRect.width;
    progressFillRef.current.style.width = `${mouseX}px`;
    // audioRef.current.currentTime =
    //   (mouseX / timeLineWidth) * audioRef.current.duration;
    // curtimeRef.current.textContent = moment
    //   .utc(audioRef.current.currentTime * 1000)
    //   .format("mm:ss");
  }, []);
  const handleProgress = useCallback((e) => {
    const progressRect = progressRef.current.getBoundingClientRect();
    const timeLineWidth = progressRect.width;
    const offsetX = e.clientX - progressRect.left;
    progressFillRef.current.style.width = `${offsetX}px`;
    // if (audioRef && audioRef.current) {
    //   audioRef.current.currentTime =
    //     (offsetX / timeLineWidth) * audioRef.current.duration;
    // }
  });
  const handleMouseDown = useCallback(() => {
    progressRef.current.addEventListener("mousemove", draggbleProgress);
  }, []);
  const handleMouseUp = useCallback(() => {
    progressRef.current.removeEventListener("mousemove", draggbleProgress);
  }, []);
  const draggbleVolume = useCallback((e) => {
    const volumeRect = progressVol.current.getBoundingClientRect();
    const volumeBarWidth = volumeRect.width;
    const mouseX = e.clientX - volumeRect.left;
    progressVolFill.current.style.width = `${mouseX}px`;
    const volumeValue = Math.floor((mouseX / volumeBarWidth) * 100) / 100;
    // audioRef.current.volume =
    //   volumeValue > 1 ? 1 : volumeValue < 0 ? 0 : volumeValue;
  }, []);
  const handleVolMouseDown = useCallback(() => {
    progressVol.current.addEventListener("mousemove", draggbleVolume);
  }, []);
  const handleVolMouseUp = useCallback(() => {
    progressVol.current.removeEventListener("mousemove", draggbleVolume);
  }, []);
  return (
    <PlayerBarStyled className="left-0 right-0 flex items-center fixed bottom-0 h-[90px] px-5 layout-bg z-30">
      <div className="  w-[30%] flex-shrink-0 flex-grow-0">
        <div className="w-full flex items-center">
          <div className=" w-16 h-16 rounded-lg overflow-hidden mr-5 shrink-0 relative">
            <LazyLoadImage
              effect="blur"
              className="info_img inline-block w-full h-full object-cover"
              src={queueSong[currentId]?.thumbnailM}
              alt=""
            />
          </div>

          <div className=" text-left items-start min-w-0 max-w-max basis-auto flex-grow flex-shrink w-0 max-1130:max-w-[155px]">
            <div className=" player-text overflow-hidden mark">
              <span>
                <span className="">
                  {/* <marquee
                    behavior={scroll}
                    direction="left"
                    scrollamount="5"
                    className=" whitespace-nowrap title font-medium leading-[1.36] text-[14px] overflow-visible text-clip pr-[4px]  player-text "
                  >
                    {queueSong[currentId].title}
                  </marquee> */}
                  <span className=" whitespace-nowrap  font-medium leading-[1.36] text-[14px]   pr-[4px] primary-text ">
                    {queueSong[currentId]?.title}
                  </span>
                </span>
              </span>
            </div>
            <div className="">
              <SingerName artists={queueSong[currentId]?.artists}></SingerName>
            </div>
          </div>
          <div className="flex item-center ml-[10px]">
            <Popover
              title="Thêm vào thư viện nhé"
              trigger="hover"
              color="#363636"
            >
              <div className="w-9 h-9  rounded-[50%]  cursor-pointer flex items-center justify-center  option">
                <icons.heart className="text-[14px] title leading-[66%] primary-text"></icons.heart>
              </div>
            </Popover>
            <Popover title="Xem thêm" trigger="hover" color="#363636">
              <div
                className="w-9 h-9  rounded-[50%]  cursor-pointer flex items-center justify-center  option"
                ref={viewRef}
                onClick={() => {
                  setIsOpenModal((state) => !state);
                }}
              >
                <icons.more className="text-[14px] title leading-[66%] primary-text"></icons.more>
              </div>
            </Popover>
            <Modal
              onClose={() => setIsOpenModal(false)}
              targetRef={viewRef}
              isOpen={isOpenModal}
              data={queueSong[currentId]}
            ></Modal>
          </div>
        </div>
      </div>
      <div className=" flex flex-col flex-grow max-w-[40vw]">
        <div className=" flex items-center mx-auto">
          <div className="cursor-pointer random_song w-8 h-8  grid place-items-center px-[3px] mx-[7px] relative group rounded-[50%] hover:bg-white hover:bg-opacity-20  group/visible">
            <icons.shuffle
              className={`text-[20px] leading-[66%] icons`}
            ></icons.shuffle>
          </div>
          <div
            className={`cursor-pointer next w-8 h-8   grid place-items-center px-[3px] mx-[7px] rounded-[50%] hover:bg-white hover:bg-opacity-20 relative group `}
          >
            <icons.backward className="text-[20px] leading-[66%] icons "></icons.backward>
          </div>
          <div className="cursor-pointer modify_active  w-9 h-9 mx-[7px] grid place-items-center p-[3px] border border-solid play_btn rounded-[50%]">
            <icons.playsharp className="text-[22px] leading-[66%] icons  ml-[2px] "></icons.playsharp>
          </div>
          <div
            className={`cursor-pointer next w-8 h-8   grid place-items-center px-[3px] mx-[7px] rounded-[50%] hover:bg-white hover:bg-opacity-20 relative group `}
          >
            <icons.forward className="text-[20px] leading-[66%] icons icons_player"></icons.forward>

            {/* {nextSongData && (
              <div className="absolute min-w-[280px] grow shrink-0 basis-0 h-auto bg-[#474F7A]  top-[-111px] text-[12px] rounded-[12px] text-center p-4  z-[10] invisible group-hover:visible">
                <div className="flex flex-col items-start">
                  <span className="text_queue mb-1">Phát tiếp theo</span>
                  <div className="flex items-center">
                    <div className="thumb w-10 h-10 rounded-[4px] overflow-hidden mr-2">
                      <img
                        src={nextSongData?.thumbnailM}
                        className="object-cover w-full h-full"
                      ></img>
                    </div>
                    <div className="content flex flex-col items-start">
                      <span className="text-white font-bold text-[14px] whitespace-nowrap">
                        {nextSongData?.title}
                      </span>
                      <div className="text_queue">
                        {nextSongData?.artists?.length > 1
                          ? nextSongData?.artists?.map((e, index) => (
                              <span
                                className="text-primary-text-color text-[12px] leading-[1.75] whitespace-nowrap"
                                key={e.id}
                              >
                                {index != nextSongData?.artists?.length - 1
                                  ? e.name + ","
                                  : e.name.length > 10
                                  ? e.name.slice(0, 10) + "..."
                                  : e.name}
                              </span>
                            ))
                          : nextSongData?.artists?.map((e) => (
                              <span
                                className="text-primary-text-color text-[12px] leading-[1.75]"
                                key={e.id}
                              >
                                {e.name}
                              </span>
                            ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute triangle bottom-[-8px] left-[50%] translate-x-[-50%] "></div>
              </div>
            )} */}
          </div>
          <div className="cursor-pointer repeat w-8 h-8  grid place-items-center px-[3px] mx-[7px] relative group rounded-[50%] hover:bg-white hover:bg-opacity-20 border-white group/visible">
            <icons.repeat className="text-[20px] leading-[66%] icons icons_player"></icons.repeat>
          </div>
        </div>
        <div className="running_bar flex w-full items-center ">
          <span
            className="text-[12px] inline-block min-w-[45px] mr-[10px] time font-medium opacity-[0.5]"
            ref={curtimeRef}
          >
            00:00
          </span>
          <div
            className=" w-full h-5  flex flex-col justify-center relative group cursor-pointer"
            ref={progressRef}
            onClick={(event) => {
              let progressRect = progressRef.current.getBoundingClientRect();
              let offsetX = event.clientX - progressRect.left;
              progressFillRef.current.style.width = `${offsetX}px`;
              const timeLineWidth = progressRect.width;
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            // onMouseMove={handleMouseMove}
          >
            <span className="z_bar z-0"></span>
            <span
              className="progress_fill absolute top-[50%] translate-y-[-50%] h-[3px] duration-bar"
              ref={progressFillRef}
            >
              <span className="z_bullet invisible group-hover:visible "></span>
            </span>
          </div>
          <span className="text-[12px] inline-block min-w-[45px] ml-[10px] time font-medium">
            {moment.utc(3600).format("mm:ss")}
          </span>
        </div>
      </div>
      <div className="flex-shrink-0 flex-grow-0 w-[30%] flex items-center justify-end ">
        <div className="w-8 h-8  flex items-center justify-center rounded-[50%] hover:bg-white hover:bg-opacity-25 mx-[5px]  cursor-pointer max-860:hidden">
          <icons.mic className="text-[20px] leading-[66%] icons icons_player"></icons.mic>
        </div>
        <div className="w-8 h-8  flex items-center justify-center rounded-[50%] hover:bg-white hover:bg-opacity-25 mx-[5px]  cursor-pointer max-860:hidden">
          <icons.store className="text-[20px] leading-[66%] icons icons_player"></icons.store>
        </div>
        <div className="volume_wrap grow-0 shrink-0 basis-0  h-8 flex items-center pr-7 relative">
          <div className=" h-8 w-8  flex items-center justify-center cursor-pointer rounded-[50%] hover:bg-white hover:bg-opacity-25 mx-[5px]  ">
            <icons.maxvolume className="text-[20px] leading-[66%] icons icons_player"></icons.maxvolume>
          </div>
          <div
            className=" w-[70px] h-[20px] flex items-center rounded-sm relative group cursor-pointer "
            ref={progressVol}
            onClick={(e) => {
              let progressVolRect = progressVol.current.getBoundingClientRect();
              let offsetX = e.clientX - progressVolRect.left;
              progressVolFill.current.style.width = `${offsetX}px`;
              const volumeValue =
                Math.floor((offsetX / progressVolRect.width) * 100) / 100;
              // audioRef.current.volume =
              //   volumeValue > 1 ? 1 : volumeValue < 0 ? 0 : volumeValue;
            }}
            onMouseUp={handleVolMouseUp}
            onMouseDown={handleVolMouseDown}
          >
            <span className="z_bar z-0"></span>
            <span
              className="progress_fill absolute top-[50%] translate-y-[-50%] "
              ref={progressVolFill}
            >
              <span className="z_bullet invisible group-hover:visible"></span>
            </span>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-white bg-opacity-30"></div>
        </div>
        <div
          className={`w-8 h-8  flex items-center justify-center rounded-md  mx-[5px]  ml-7 cursor-pointer  ${
            isAppear ? "bg-[--purple-primary]" : "bg-[hsla(0,0%,100%,.2)]"
          }
          }`}
          onClick={() => {
            setIsAppear((state) => !state);
          }}
        >
          <icons.listmusic className="text-[20px] leading-[66%] icons icons_player"></icons.listmusic>
        </div>
        <RightSideBar appear={isAppear}></RightSideBar>
      </div>
      <div className="fixed bottom-[-100%] w-full h-[30px]">
        {/* <audio
            src={"https://a128-z3.zmdcdn.me/913ac02be4c8248446792481bfe838a7?authen=exp=1733582202~acl=/913ac02be4c8248446792481bfe838a7*~hmac=dc8085ad74ab467398a7d446b7a67c55"}
            ref={audioRef}
            onTimeUpdate={(e) => {
              let { duration, currentTime } = e.target;
              let percent = (currentTime / duration) * 100;
              progressFillRef.current.style.width = `${percent}%`;
              curtimeRef.current.textContent = moment
                .utc(currentTime * 1000)
                .format("mm:ss");
            }}
            // onEnded={handleEnd}
            onPlaying={() => {
              setPause(false);
            }}
            onPause={() => {
              setPause(true);
            }}
          ></audio> */}
      </div>
    </PlayerBarStyled>
  );
};
const PlayerBarStyled = styled.div`
  .not_allowed {
    cursor: not-allowed;
  }
  .text_queue {
    color: hsla(0, 0%, 100%, 0.6);
  }

  .active_btn {
    background-color: var(--purple-primary);
  }
  .progress_fill {
    opacity: 1;
    background-color: var(--progressbar-active-bg);
    height: 3px;
    border-radius: 1.5px;
    cursor: pointer;
    display: inline-block;
    left: 0;
    width: 0px;
  }
  .z_bar {
    opacity: 1;
    background-color: var(--progressbar-player-bg);
    height: 3px;
    border-radius: 1.5px;
    cursor: pointer;
    position: absolute;
    display: inline-block;
    left: 0;
    width: 100%;
  }
  .z_bullet {
    transition: all 0.2s, width 0s;
    height: 12px;
    width: 12px;
    top: 0;
    background-color: var(--progressbar-active-bg);
    box-shadow: 0 0 1px #f7f7f7;
    border-radius: 50%;
    display: inline-block;
    position: absolute;
    right: -6px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
  }
  .icons {
    color: var(--player-text);
  }

  .text_wrapper {
    word-break: break-word;
    -webkit-mask-image: linear-gradient(270deg, transparent 0.5%, #000 10%);
  }
  .title {
    color: var(--player-text);
  }
  .subtitle {
    color: var(--text-secondary);
  }

  .subtitle > span:not(:last-child):hover {
    color: var(--link-text-hover);
    text-decoration: underline;
    text-decoration-thickness: 0.3px;
  }
  .time {
    color: var(--player-text);
  }
  .progress {
    -webkit-appearance: none;
    appearance: none;
    outline: none;
    cursor: pointer;
    background: linear-gradient(
      to right,
      var(--progressbar-active-bg) 0%,
      var(--progressbar-player-bg) 0%
    );
  }
  //circle
  .progress::-webkit-slider-thumb {
    opacity: 0;
    visibility: hidden;
    right: 0;
    -webkit-appearance: none;
    appearance: none;
    height: 15px;
    width: 15px;
    background-color: var(--progressbar-active-bg);
    border-radius: 50%;
    border: none;
    transition: all 0.1s linear;
  }
  .progress:hover::-webkit-slider-thumb {
    opacity: 1;
    visibility: visible;
  }
  .progress_volume {
    -webkit-appearance: none;
    appearance: none;
    outline: none;
    cursor: pointer;
    background: linear-gradient(
      to right,
      var(--progressbar-active-bg) 0%,
      var(--progressbar-player-bg) 0%
    );
  }
  .progress_volume::-webkit-slider-thumb {
    opacity: 0;
    visibility: hidden;
    right: 0;
    -webkit-appearance: none;
    appearance: none;
    height: 15px;
    width: 15px;
    background-color: var(--progressbar-active-bg);
    border-radius: 50%;
    border: none;
    transition: all 0.1s linear;
  }
  .progress_volume:hover::-webkit-slider-thumb {
    opacity: 1;
    visibility: visible;
  }
  .volume_icon:hover::-webkit-slider-thumb {
    opacity: 1;
    visibility: visible;
  }
  .play_btn {
    border-color: var(--player-text);
  }
  .play_icons {
    color: var(--player-text);
  }
`;

export default PlayerBar;
