import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import icons from "../utils/icons";
import { createSearchParams, useParams } from "react-router-dom";
import { useCallback } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import moment from "moment";
import { Link } from "react-router-dom";
import Hls from "hls.js";
import { getVideo } from "../apis/zing-api/video.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SingerName } from "../components";
import { Popover } from "antd";
import { Loading } from "../components";
import HISTORY_KEY, { addToHistory } from "../helpers/history";
import {
  addFavoriteMV,
  deleteMVFromCollection,
  getMVCollection,
} from "../apis/mongoose-api/mv.api";
import { Modal } from "antd";
import toast from "../helpers/notification";
import Spinner from "../components/Spinner";
import { CollectVideoBtn } from "../components";
import { useSelector } from "react-redux";
import { isLoginSelector } from "../redux/auth/selector";

let timer;
const Videos = () => {
  const isLogin = useSelector(isLoginSelector);
  const [fullScreen, setFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [loadVideoError, setLoadVideoError] = useState(false);
  const [volumeValue, setVolumeValue] = useState(1);
  const { id } = useParams();
  const videoRef = useRef();
  const controlRef = useRef();
  const emptyRef = useRef();
  const durationRef = useRef();
  const progressFillRef = useRef();
  const currentTimeRef = useRef();
  const progressRef = useRef();
  const seektimeRef = useRef();
  const playRef = useRef();
  const queueRef = useRef();
  const video_queueRef = useRef();
  const list_playing_bodyRef = useRef();
  const volumebarRef = useRef();
  const volumefillRef = useRef();
  const volumeRef = useRef();
  const headerRef = useRef();
  const [pause, setPause] = useState(true);
  const [recommends, setRecommends] = useState(null);
  const [videoSrc, setVideoSrc] = useState(null);
  const { isPending, isError, error, data } = useQuery({
    queryKey: ["video", id],
    queryFn: () => getVideo(id),
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
  const {
    isPending: isPendingCollectMV,
    isLoading: isLoadingCollectMV,
    isError: isErrorMV,
    error: errorMV,
    data: mvcollection,
  } = useQuery({
    queryKey: ["videocollection"],
    queryFn: getMVCollection,
    enabled: !!isLogin,
  });
  useEffect(() => {
    if (data) {
      const prevOpenUrl = localStorage.getItem("prev_open_url");
      let searchParams = createSearchParams({
        p: data.data.data.title,
      }).toString();
      const currentUrl = `${window.location}/tim-kiem/tat-ca?${searchParams}`;
      if (!prevOpenUrl) {
        localStorage.setItem("prev_open_url", currentUrl);
      }
    }
  }, [data]);
  useEffect(() => {
    if (data) {
      setVideoSrc(data.data.data["streaming"]["hls"]["360p"]);
    }
  }, [data]);
  useEffect(() => {
    if (data) {
      setRecommends(data.data.data.recommends);
    }
  }, [data]);
  useEffect(() => {
    if (videoRef && videoRef.current) {
      const video = videoRef.current;
      if (videoSrc) {
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(videoSrc);
          hls.attachMedia(video);

          hls.on(Hls.Events.ERROR, (event, data) => {
            setLoadVideoError(true);
          });

          // Cleanup on unmount (if you're using a framework like React)
          return () => hls.destroy();
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          // Safari or other browsers with native HLS support
          video.src = videoSrc;
        } else {
          setLoadVideoError(true);
          console.error("HLS is not supported in this browser.");
        }
      }
    }
  }, [videoSrc, videoRef]);

  const handleClick = useCallback((e) => {
    if (e.target.isEqualNode(emptyRef.current)) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, []);
  const hiddenControl = useCallback(() => {
    if (videoRef.current.paused) {
      return;
    }
    timer = setTimeout(() => {
      if (fullScreen) {
        headerRef.current.classList.add("hidden");
      }
      controlRef?.current?.classList?.add("hidden_control");
    }, 3000);
  }, [fullScreen]);
  const draggbleProgress = useCallback((event) => {
    const progressRect = progressRef.current.getBoundingClientRect();
    const mouseX = event.clientX - progressRect.left;
    const timeLineWidth = progressRect.width;
    progressFillRef.current.style.width = `${mouseX}px`;
    videoRef.current.currentTime =
      (mouseX / timeLineWidth) * videoRef.current.duration;
    currentTimeRef.current.textContent = moment
      .utc(videoRef.current.currentTime * 1000)
      .format("mm:ss");
  }, []);
  const handleProgress = (e) => {
    const timeLineWidth = progressRef.current.clientWidth;
    videoRef.current.currentTime =
      (e.nativeEvent.offsetX / timeLineWidth) * videoRef.current.duration;
    progressFillRef.current.style.width = `${e.nativeEvent.offsetX}px`;
  };
  const handleProgressMove = (e) => {
    e.stopPropagation();
    let timeLineWidth = progressRef.current.clientWidth;
    let offsetX = e.nativeEvent.offsetX;
    let percent = Math.floor(
      (offsetX / timeLineWidth) * videoRef.current.duration
    );
    seektimeRef.current.style.left = `${offsetX}px`;
    seektimeRef.current.textContent = moment
      .utc(percent * 1000)
      .format("mm:ss");
    seektimeRef.current.classList.remove("hidden");
    seektimeRef.current.classList.add("block");
  };
  const handleMouseDown = useCallback(() => {
    progressRef.current.addEventListener("mousemove", draggbleProgress);
  }, []);
  const handleMouseUp = useCallback(() => {
    progressRef.current.removeEventListener("mousemove", draggbleProgress);
  }, []);
  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.paused
        ? videoRef.current.play()
        : videoRef.current.pause();
    }
  };
  const handleVolume = useCallback((e) => {
    const volumeBarWidth = volumebarRef.current.clientWidth;
    const value =
      Math.floor((e.nativeEvent.offsetX / volumeBarWidth) * 100) / 100 < 0
        ? 0
        : Math.floor((e.nativeEvent.offsetX / volumeBarWidth) * 100) / 100;
    setVolumeValue(value);
    volumefillRef.current.style.width = `${e.nativeEvent.offsetX}px`;
  }, []);
  const draggbleVolume = useCallback((event) => {
    const volumeRect = volumeRef.current.getBoundingClientRect();
    const volumeBarWidth = volumeRect.width;
    const mouseX = event.clientX - volumeRect.left;
    volumefillRef.current.style.width = `${mouseX}px`;
    const value =
      Math.floor((event.offsetX / volumeBarWidth) * 100) / 100 < 0
        ? 0
        : Math.floor((event.offsetX / volumeBarWidth) * 100) / 100;
    setVolumeValue(value);
  }, []);

  const handleVolMouseDown = useCallback(() => {
    volumebarRef.current.addEventListener("mousemove", draggbleVolume);
  }, []);
  const handleVolMouseUp = useCallback(() => {
    volumebarRef.current.removeEventListener("mousemove", draggbleVolume);
  }, []);

  useEffect(() => {
    if (videoRef.current && videoSrc) {
      videoRef.current.pause();
      progressFillRef.current.style.width = "0px";
      hiddenControl();
      window.addEventListener("click", handleClick);
      videoRef.current.addEventListener("pause", () => setPause(true));
      videoRef.current.addEventListener("play", () => setPause(false));
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("pause", () => setPause(true));
        videoRef.current.removeEventListener("play", () => setPause(false));
      }
      window.removeEventListener("click", handleClick);
    };
  }, [videoSrc]);

  useEffect(() => {
    if (videoRef && videoRef.current) {
      videoRef.current.volume = volumeValue;
    }
  }, [volumeValue]);
  if (isPending) {
    return (
      <>
        <div className="w-screen h-screen bg-black">
          <Loading />
        </div>
      </>
    );
  }
  if (isError || isErrorMV) {
    return <span>Error: {error.message || errorMV.error}</span>;
  }
  return (
    <VideoStyled className={`animate-appear`}>
      <div className="relative w-full h-full overflow-hidden">
        <div className="video_scroll no-scrollbar">
          <div className="video_wrapper h-full relative">
            <div
              className={`bg-[rgba(0,0,0,0.5)] min-h-[100vh]  relative z-[9999] ${
                fullScreen ? "" : "pt-[85px]"
              }`}
              id="video-container"
            >
              <div>
                <div
                  className={`absolute top-0 left-0 right-0 p-[20px] h-[85px] z-[9999] ${
                    fullScreen
                      ? "bg-gradient-to-b from-black to-transparent"
                      : ""
                  }`}
                  ref={headerRef}
                >
                  <div className="level flex justify-between items-center">
                    <div className="level_left">
                      <div className="level_item">
                        <div className="media">
                          <div className="media_left">
                            <div className="h-10 w-10 rounded-[50%] overflow-hidden">
                              <LazyLoadImage
                                alt=""
                                src={data?.data?.data["artists"][0].thumbnail}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          </div>
                          <div className="media_content">
                            <h2 className="title">{data?.data?.data.title}</h2>
                            <div className="subtitle">
                              {data?.data?.data["artists"][0].name}
                            </div>
                          </div>
                          {isErrorMV || isLoadingCollectMV || !mvcollection ? (
                            <div className="media_right flex items-center">
                              <Popover
                                title="Thêm vào thư viện"
                                trigger={"hover"}
                                color="#363636"
                                placement="bottom"
                              >
                                <div
                                  className="icon_div h-10 w-10 rounded-[50%] flex items-center justify-center"
                                  onClick={() => {
                                    alert("Hãy đăng nhập để trải nghiệm");
                                  }}
                                >
                                  <icons.heart
                                    className={"text-[#fff] text-[20px]"}
                                  ></icons.heart>
                                </div>
                              </Popover>

                              <Popover
                                title="Thêm vào thư viện"
                                trigger={"hover"}
                                color="#363636"
                                placement="bottom"
                              >
                                <div className="icon_div h-10 w-10 rounded-[50%] flex items-center justify-center">
                                  <icons.notemusic className="icon "></icons.notemusic>
                                </div>
                              </Popover>
                              <Popover
                                title="Khác"
                                trigger={"hover"}
                                color="#363636"
                                placement="bottom"
                              >
                                <div className="icon_div h-10 w-10 rounded-[50%] flex items-center justify-center">
                                  <icons.more className="icon "></icons.more>
                                </div>
                              </Popover>
                            </div>
                          ) : (
                            <>
                              <div className="media_right flex items-center">
                                <CollectVideoBtn
                                  videoData={data.data.data}
                                  mvcollection={mvcollection.data.favorite}
                                />
                                <Popover
                                  title="Thêm vào thư viện"
                                  trigger={"hover"}
                                  color="#363636"
                                  placement="bottom"
                                >
                                  <div className="icon_div h-10 w-10 rounded-[50%] flex items-center justify-center">
                                    <icons.notemusic className="icon "></icons.notemusic>
                                  </div>
                                </Popover>
                                <Popover
                                  title="Khác"
                                  trigger={"hover"}
                                  color="#363636"
                                  placement="bottom"
                                >
                                  <div className="icon_div h-10 w-10 rounded-[50%] flex items-center justify-center">
                                    <icons.more className="icon "></icons.more>
                                  </div>
                                </Popover>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`level_right flex items-center ${
                        fullScreen ? "hidden" : ""
                      }`}
                    >
                      <div
                        className="icon_div h-10 w-10 rounded-[50%] flex items-center justify-center"
                        onClick={() => {
                          videoRef.current.requestPictureInPicture();
                        }}
                      >
                        <icons.minimize className="icon "></icons.minimize>
                      </div>
                      <div
                        className="icon_div h-10 w-10 rounded-[50%] flex items-center justify-center"
                        onClick={() => {
                          const prevOpenUrl =
                            localStorage.getItem("prev_open_url");
                          if (!prevOpenUrl) {
                            let searchParams = createSearchParams({
                              p: data.data.data.title,
                            }).toString();
                            const prevUrl = `${window.location}/tim-kiem/tat-ca?${searchParams}`;
                            window.location.href = prevUrl;
                            // navigate(prevUrl, { replace: true }); // Absolute URL
                          } else {
                            window.location.href = prevOpenUrl;

                            // navigate(prevOpenUrl, { replace: true }); // Absolute URL
                          }
                        }}
                      >
                        <icons.close className="icon "></icons.close>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`relative text-[#fff] mx-auto rounded overflow-hidden  ${
                    fullScreen ? "w-[100vw] mx-0" : "w-[95vw] "
                  }`}
                >
                  <div className="container min-w-full">
                    <div
                      className={`relative mx-[-15px] flex-wrap flex max-1250:flex-col ${
                        fullScreen ? "flex-col" : ""
                      }`}
                    >
                      <div
                        className={`block mb-0  px-[15px] max-1250:w-full ${
                          fullScreen ? "w-full" : "w-[calc(100%-350px)]"
                        }`}
                      >
                        <div className="video_wrap ">
                          <div
                            className="z_player relative pb-[56.25%]  "
                            onMouseMove={(e) => {
                              clearTimeout(timer);
                              if (fullScreen) {
                                headerRef.current.classList.remove("hidden");
                              }
                              controlRef.current.classList.remove(
                                "hidden_control"
                              );
                              hiddenControl();
                            }}
                            ref={emptyRef}
                          >
                            {loadVideoError && (
                              <div className="absolute inset-0 z-[999]  bg-[#333] flex text-white  items-center justify-center">
                                Trình duyệt không thể tải video này!
                              </div>
                            )}

                            <video
                              id="video"
                              // controls
                              width={300}
                              height={200}
                              ref={videoRef}
                              className="video "
                              preload="metadata"
                              onLoadedData={() => {
                                durationRef.current.textContent = moment
                                  .utc(videoRef.current.duration * 1000)
                                  .format("mm:ss");
                              }}
                              onTimeUpdate={(e) => {
                                let { currentTime, duration } = e.target;
                                let percent = (currentTime / duration) * 100;
                                progressFillRef.current.style.width = `${percent}%`;
                                currentTimeRef.current.textContent = moment
                                  .utc(currentTime * 1000)
                                  .format("mm:ss");
                              }}
                              onWaiting={() => {
                                setIsLoading(true);
                              }}
                              onPlaying={() => setIsLoading(false)} // Stop loading
                            ></video>

                            <div
                              className="z_controls_wrapper"
                              ref={controlRef}
                            >
                              <div className="z_controls">
                                <div
                                  className="z_progress_bar"
                                  ref={progressRef}
                                  onClick={handleProgress}
                                  onMouseMove={handleProgressMove}
                                  onMouseLeave={() => {
                                    seektimeRef.current.classList.remove(
                                      "block"
                                    );
                                    seektimeRef.current.classList.add("hidden");
                                  }}
                                  onMouseDown={handleMouseDown}
                                  onMouseUp={handleMouseUp}
                                >
                                  <span className="z_bar"></span>
                                  <span
                                    className="z_seek_time hidden"
                                    ref={seektimeRef}
                                  >
                                    00:00
                                  </span>
                                  <span
                                    className="z_bar_fill_recent"
                                    ref={progressFillRef}
                                  >
                                    <span className="z_bullet"></span>
                                  </span>
                                  <span className="z_progress_bar_lay absolute inset-0 z-[99]"></span>
                                </div>
                                <div className="z_control_left">
                                  <div className={`z_control `}>
                                    <icons.backward className="z_icons text-[#eaeaea]"></icons.backward>
                                  </div>
                                  <div
                                    className="z_control"
                                    onClick={handlePlayVideo}
                                  >
                                    {pause ? (
                                      <icons.playsharp className="z_icons text-[#eaeaea] z_play_icons"></icons.playsharp>
                                    ) : (
                                      <icons.pause className="z_icons text-[#eaeaea] z_play_icons"></icons.pause>
                                    )}
                                  </div>
                                  <div className={`z_control `}>
                                    <icons.forward className="z_icons text-[#eaeaea]"></icons.forward>
                                  </div>
                                  <div
                                    className="z_control"
                                    onMouseOver={() => {
                                      volumeRef.current.classList.add(
                                        "is-hover"
                                      );
                                    }}
                                    onMouseLeave={() => {
                                      volumeRef.current.classList.remove(
                                        "is-hover"
                                      );
                                    }}
                                  >
                                    {volumeValue === 0 ? (
                                      <icons.mutedvolume className="z_icons text-[#eaeaea]"></icons.mutedvolume>
                                    ) : (
                                      <icons.maxvolume className="z_icons text-[#eaeaea]"></icons.maxvolume>
                                    )}
                                    <span
                                      className="zm_volume_bar "
                                      ref={volumeRef}
                                    >
                                      <span className="z__bar"></span>
                                      <span
                                        className=" z_bar_fill_recent  z_volume_fill top-[14px]"
                                        ref={volumefillRef}
                                      >
                                        <span className="z_bullet"></span>
                                        {/* circle */}
                                      </span>
                                      <span
                                        className="absolute inset-0 z-[999] "
                                        ref={volumebarRef}
                                        onClick={handleVolume}
                                        onMouseDown={handleVolMouseDown}
                                        onMouseUp={handleVolMouseUp}
                                      ></span>
                                    </span>
                                  </div>
                                  <div className="z_control control_time">
                                    <span
                                      className="pr-[5px]"
                                      ref={currentTimeRef}
                                    ></span>
                                    <span>|</span>
                                    <span
                                      className="pl-[5px]"
                                      ref={durationRef}
                                    ></span>
                                  </div>
                                </div>
                                <div className="z_control_right flex items-center">
                                  <Popover
                                    title={autoPlay ? "Không lặp" : "Lặp lại"}
                                    trigger={"hover"}
                                    color="#363636"
                                    placement="top"
                                  >
                                    <div
                                      className="z_control"
                                      onClick={() => {
                                        setAutoPlay((state) => !state);
                                      }}
                                    >
                                      <icons.repeat
                                        className={`z_icons ${
                                          autoPlay ? "text-[#721799]" : ""
                                        } `}
                                      ></icons.repeat>
                                    </div>
                                  </Popover>
                                  <Popover
                                    title="Cài đặt"
                                    trigger={"hover"}
                                    color="#363636"
                                    placement="top"
                                  >
                                    <div className="z_control">
                                      <icons.setting className="z_icons text-[#eaeaea]"></icons.setting>
                                    </div>
                                  </Popover>

                                  <Popover
                                    title={
                                      fullScreen
                                        ? "Thu nhỏ màn hình"
                                        : "Toàn màn hình"
                                    }
                                    trigger={"hover"}
                                    color="#363636"
                                    placement="top"
                                  >
                                    <div
                                      className="z_control"
                                      onClick={() => {
                                        if (data) {
                                          const element =
                                            document.querySelector(
                                              ".video_scroll"
                                            );
                                          const isFullScreen =
                                            document.fullscreenElement;
                                          if (isFullScreen) {
                                            setFullScreen(false);
                                            document.exitFullscreen();
                                          } else {
                                            setFullScreen(true);
                                            element.requestFullscreen();
                                          }
                                        }
                                      }}
                                    >
                                      <icons.maximize className="z_icons text-[#eaeaea]"></icons.maximize>
                                    </div>
                                  </Popover>
                                </div>
                              </div>
                            </div>
                            {/* <div
                              className="h-12 w-12 absolute border border-solid rounded-[50%] border-[#fff] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  z-[9999] cursor-pointer "
                              ref={playRef}
                              // onClick={() => {
                              //   videoRef.current.currentTime = 0;
                              //   progressFillRef.current.style.width = "0px";
                              //   videoRef.current.play();
                              //   playRef.current.classList.remove("block");
                              //   playRef.current.classList.add("hidden");
                              // }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center">
                                <icons.playsharp className="text-[20px] text-[#fff] ml-[2px]"></icons.playsharp>
                              </div>
                            </div> */}
                            {isLoading && (
                              <div className="h-12 w-12 absolute   top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  z-[9999] cursor-pointer ">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Spinner />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {fullScreen && (
                        <div
                          className={`w-full h-[105px] bg-black   
                         `}
                        ></div>
                      )}

                      <div
                        className={`max-1250:w-full ${
                          fullScreen ? "w-full" : "w-[350px] "
                        } column`}
                        ref={queueRef}
                      >
                        <div
                          className="video_queue rounded "
                          ref={video_queueRef}
                        >
                          <div className="h-[100%] flex flex-col mb-[30px]">
                            <div
                              className={`p-5 flex  max-1250:gap-[30px]  ${
                                fullScreen
                                  ? "gap-[30px]"
                                  : " min-1250:justify-between"
                              }`}
                            >
                              <h3 className=" text-white font-bold text-[18px]">
                                Danh gợi í
                              </h3>
                              <div
                                className={`max-1250:px-[15px] max-1250:rounded-full max-1250:bg-[--alpha-bg] bg-transparent flex items-center w-auto h-7 uppercase cursor-pointer  ${
                                  fullScreen
                                    ? "px-[15px] rounded-full bg-[--alpha-bg]"
                                    : ""
                                }`}
                              >
                                <div className="text-[10px] uppercase text-white ">
                                  tự động phát
                                </div>
                                <div
                                  className={`w-6 h-[15px]  ml-[5px] 
                                    relative rounded-full wrap_switch ${
                                      !autoPlay
                                        ? "bg-[#721799]"
                                        : "bg-[#9fa4b1]"
                                    }`}
                                  onClick={() => {
                                    setAutoPlay((state) => !state);
                                  }}
                                >
                                  <div
                                    className={`absolute w-[13px] h-[13px] rounded-[50%] bg-white  top-[50%] translate-y-[-50%] transition-all duration-150 ease-linear switch ${
                                      !autoPlay ? "left-[11px]" : "left-0"
                                    }`}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            <div
                              className={` flex-grow scroll_theme max-1250:overflow-x-auto  ${
                                fullScreen
                                  ? "overflow-x-auto"
                                  : "overflow-y-auto"
                              }`}
                            >
                              <div
                                className={`flex  max-1250:flex-row  ${
                                  fullScreen ? "flex-row" : "flex-col"
                                }`}
                                ref={list_playing_bodyRef}
                              >
                                {recommends?.map((mv) => (
                                  <div
                                    className={`px-5 flex items-center gap-2 py-[6px] cursor-pointer min-1250:hover:bg-[hsla(0,0%,100%,.05)] max-1250:w-[25%] max-1250:px-[12px] max-1250:flex-col max-1250:items-start flex-shrink-0 ${
                                      fullScreen
                                        ? "w-[25%] px-[12px] flex-col items-start"
                                        : ""
                                    }`}
                                    key={mv.encodeId}
                                  >
                                    <div
                                      className={`flex-grow-0 flex-shrink-0 w-[120px] h-[64px] overflow-hidden rounded-[4px] relative group max-1250:w-full max-1250:pb-[56.25%]  ${
                                        fullScreen ? "w-full pb-[56.25%]" : ""
                                      }`}
                                    >
                                      <LazyLoadImage
                                        effect="opacity"
                                        src={mv.thumbnailM}
                                        className="w-full h-full object-cover group-hover:scale-125 transition-all ease-linear duration-300"
                                      ></LazyLoadImage>
                                      <Link
                                        to={mv.link.split(".")[0]}
                                        className=" absolute inset-0 dark-alpha-50  z-[1] hidden group-hover:block"
                                        onClick={() => {
                                          addToHistory(HISTORY_KEY.MV, mv);
                                        }}
                                      >
                                        <span className="absolute flex items-center justify-center w-10 h-10 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  cursor-pointer border border-white rounded-full">
                                          <icons.play className="text-[16px] text-white"></icons.play>
                                        </span>
                                      </Link>
                                    </div>
                                    <div
                                      className={`flex-auto max-1250:w-full ${
                                        fullScreen ? "w-full" : ""
                                      }`}
                                    >
                                      <div className="flex items-center">
                                        <Link
                                          to={mv.link.split(".")[0]}
                                          className="w-0 flex-auto  text-[14px] text-[#fff]  line-clamp-1 hover:text-[#c662ef]"
                                          onClick={() => {
                                            addToHistory(HISTORY_KEY.MV, mv);
                                          }}
                                        >
                                          {mv.title}
                                        </Link>
                                      </div>
                                      <SingerName
                                        videopage={true}
                                        artists={mv.artists}
                                      ></SingerName>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg_alpha"></div>
            <div
              className="bg_blur"
              style={{
                backgroundImage: `url(${data.data.data.thumbnailM})`,
              }}
            ></div>
          </div>
        </div>
      </div>
      <WrappedToastify className="zm_notify_list"></WrappedToastify>
    </VideoStyled>
  );
};
const WrappedToastify = styled.div`
  position: absolute;
  z-index: 9999;
  bottom: 90px;
  left: 0;
  width: 360px;
  transform: translateX(-100%);
  .close_toast {
    color: var(--text-primary);
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
  .toast_bg {
    width: 100%;
    padding: 10px 20px;
    border-radius: 4px;
    background-color: var(--primary-bg);
    box-shadow: 0 2px 5px var(--portal-menu-box-shadow);
  }
  li {
    width: 100%;
    padding: 10px 20px;
    border-radius: 4px;
    background-color: var(--primary-bg);
    box-shadow: 0 2px 5px var(--portal-menu-box-shadow);
    transform: translateX(100%);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  li span {
    color: var(--text-primary);
    line-height: 1.3;
    font-size: 14px;
  }
  .bold_text {
    font-weight: 500;
  }
  @keyframes fadeOut {
    to {
      opacity: 0;
    }
  }
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(0);
    }
    to {
      opacity: 1;
      transform: translateX(100%);
    }
  }
`;
const VideoStyled = styled.div`
  transition: all 0.8s linear;
  position: fixed;
  inset: 0;
  z-index: 9999;
  background-color: #1e1e1e;

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  .no-scrollbar {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }

  .scroll_theme::-webkit-scrollbar {
    width: 5px;
    background-color: transparent;
    border-radius: 4px;
  }
  .scroll_theme::-webkit-scrollbar-thumb {
    background-color: var(--scroll-thumb-bg);
    border-radius: 4px;
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
  .video_wrap.theater_mode {
    height: 100%;
  }

  .video_body {
    position: relative;
    color: #fff;
    margin: 0 auto;
    border-radius: 4px;
    overflow: hidden;
    width: 95vw;
  }
  .video_body.theater_mode {
    width: 100vw;
    border-radius: 0;
  }
  .zm_car_media_content {
    flex-basis: auto;
    flex-grow: 1;
    flex-shrink: 1;
    text-align: left;
    align-self: center;
    width: 0;
  }

  .level_item {
    flex-grow: 1;
    align-items: center;
    display: flex;
    flex-basis: auto;
    flex-shrink: 0;
    justify-content: center;
  }
  .media {
    align-items: center;
    display: flex;
    text-align: left;
    border-radius: 5px;
  }
  .media_left {
    flex-basis: auto;
    flex-grow: 0;
    flex-shrink: 0;
    margin-right: 10px;
  }
  .title {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 100%;
    line-height: normal;
    font-size: 18px;
    color: rgb(255, 255, 255);
    font-weight: 700;
  }
  .subtitle {
    color: var(--text-secondary);
    margin-top: 3px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 100%;
    line-height: normal;
    font-size: 14px;
  }
  .media_right {
    margin-left: 20px;
    flex-basis: auto;
    flex-grow: 0;
    flex-shrink: 0;
  }
  .icon_div {
    box-shadow: rgba(133, 105, 208, 0.11) 0px 2px 4px 0px;
    background-color: rgba(255, 255, 255, 0.1);
    cursor: pointer;
    text-align: center;
    margin-right: 10px;
  }
  .icon {
    line-height: 66%;
    display: inline-block;
    padding: 5px;
    border-radius: 50%;
    font-size: 32px;
    vertical-align: middle;
    color: var(--white);
  }
  .container {
    margin: 0 auto;
    position: relative;
  }

  .column {
    display: block;
    flex-shrink: 1;
    padding: 0 15px;
  }
  .video_player {
    margin-bottom: 0 !important;
    width: calc(100% - 350px);
    display: block;
    flex-shrink: 1;
    padding: 0 15px;
  }
  .video_player.theater_mode {
    width: 100%;
    height: calc(100vh - 115px);
  }

  .z_player {
    box-sizing: border-box;
    outline: none;
    background-color: #000;
    overflow: hidden;
    border-radius: 4px;
  }
  .z_player.theater_mode {
    height: 100% !important;
    padding-bottom: 0;
  }
  .video {
    height: 100%;
    width: 100%;
    object-fit: contain;
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
  }

  .video_queue {
    position: relative;
    color: #fff;
  }
  .video_queue {
    background-color: hsla(0, 0%, 100%, 0.10196078431372549);
    overflow: hidden;
    height: calc(53.4375vw - 196.875px);
    width: auto;
    margin-top: 0;
  }
  /* .video_queue {
    margin: 30px 30px auto;
  } */
  .list_playing {
    height: 100%;
  }

  .list_playing_body {
    height: calc(100% - 70px);
  }

  .video_queue_scroll {
    position: absolute;
    inset: 0px;
    overflow: hidden scroll;
    margin-right: -6px;
    margin-bottom: 0px;
  }
  .zm_carousel_wrapper {
    position: relative;
  }
  .zm_carousel.is_vertical {
    margin: 0;
    display: flex;
    user-select: none;
  }
  .zm_carousel_container.is_vertical {
    display: flex;
    z-index: 3;
    width: 100%;
    transform: translate3d(0px, 0px, 0px);
    flex-wrap: wrap;
  }

  .zm_carousel_container.theater_mode {
    margin-left: -28px;
    flex-wrap: nowrap;
    display: flex;
  }
  .zm_card {
    display: flex;
    width: 100%;
    position: relative;
  }
  .zm_card.is_vertical {
    background-color: hsla(0, 0%, 100%, 0.05);
    padding: 5px 20px;
  }
  .zm_card.theater_mode {
    flex-direction: column;
    margin-left: 28px;
    width: calc(((100%) / 5) - 28px);
  }
  .zm_card_media {
    padding: 0 0 0 10px;
    /* width: calc(100% - 120px); */
  }
  .card_title {
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 100%;
    font-weight: 700;
    white-space: nowrap;
  }
  .card_subtitle {
    display: block;
    font-size: 12px;
    margin-top: 3px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 100%;
    line-height: normal;
    color: hsla(0, 0%, 100%, 0.5);
  }
  .video_recommend {
    background-color: hsla(0, 0%, 100%, 0.05);
  }
  .video_footer {
    position: relative;
    color: #fff;
    margin: 40px auto 0;
    padding-bottom: 30px;
    border-radius: 4px;
    overflow: hidden;
    width: 95vw;
  }
  .video_scroll {
    position: absolute;
    inset: 0px;
    overflow: hidden scroll;
    margin-right: -6px;
    margin-bottom: 0px;
  }
  .z_controls_wrapper {
    position: absolute;
    width: 100%;
    bottom: 0;
    background-image: linear-gradient(
      to bottom,
      transparent,
      rgba(0, 0, 0, 0.8)
    );
    height: 100px;
    transition: all 0.3s ease;
  }
  .z_controls_wrapper.hidden_control {
    bottom: -15px;
    opacity: 0;
  }
  .z_controls {
    padding: 13px 8px;
    left: 12px;
    width: calc(100% - 24px);
    display: flex;
    position: absolute;
    bottom: 0;
    text-shadow: 0 0 2px #000;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    opacity: 1;
  }
  .z_progress_bar {
    position: absolute;
    width: 100%;
    height: 20px;
    cursor: pointer;
    bottom: 50px;
    z-index: 10;
  }
  .z_bar {
    opacity: 1;
    background-color: rgb(98, 98, 98);
    height: 3px;
    top: 9px;
    border-radius: 1.5px;
    cursor: pointer;
    position: absolute;
    display: inline-block;
    left: 0;
    width: 100%;
  }
  .z_bar_fill_recent {
    transition: height 0.2s, transform 0.2s cubic-bezier(0, 0, 0.2, 1), top 0.2s;
    height: 3px;
    top: 9px;
    background-color: #721799;
    border-radius: 1.5px;
    cursor: pointer;
    position: absolute;
    display: inline-block;
    left: 0;
    width: 0px;
    z-index: 1;
  }
  .z_volume_fill {
    top: 14px;
    width: 70px;
  }
  .z_bullet {
    transition: all 0.2s, width 0s;
    height: 12px;
    width: 12px;
    background-color: #f7f7f7;
    box-shadow: 0 0 1px #f7f7f7;
    border-radius: 50%;
    display: inline-block;
    position: absolute;
    right: -6px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
  }
  .z_control_left {
    display: flex;
    flex-grow: 1;
    text-shadow: 0 0 2px #000;
    color: #fff;
    line-height: 1.5;
  }
  .z_control {
    margin: 0 10px;
    padding: 0;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    font-size: 10px;
  }
  .z_control.not_allowed {
    cursor: not-allowed;
  }
  .z_icons {
    font-size: 20px;
    line-height: 66%;
    display: inline-block;
  }
  .z_icons:hover {
    color: #8d22c3;
  }
  .z_icons.is-active {
    color: #8d22c3;
  }
  .z_play_icons {
    font-size: 28px;
  }
  .zm_volume_bar {
    width: 0;
    opacity: 0;
    margin: 0;
    overflow: hidden;
    will-change: width, opacity, margin-left;
    transition: width 0.2s, opacity 0.2s, margin-left 0.2s;
    height: 30px;
    display: inline-block;
    position: relative;
    vertical-align: top;
    cursor: pointer;
  }
  .z__bar {
    background-color: #4d4d4d;
    width: 100%;
    border-radius: 1.5px;
    cursor: pointer;
    height: 3px;
    position: absolute;
    display: inline-block;
    top: 14px;
    left: 0;
  }

  .is-hover {
    width: 70px;
    box-sizing: border-box;
    opacity: 1;
    margin-left: 13px;
    margin-right: 8px;
    overflow: visible;
  }
  .control_time {
    display: flex;
  }
  .control_time > span {
    color: #f7f7f7;
    font-weight: 500;
    line-height: 20px;
    display: inline-block;
    font-size: 12px;
  }
  .z_seek_time {
    margin-left: -19.5px;
    left: 0px;
    color: #f7f7f7;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 2px;
    padding: 2px 5px;
    font-size: 11px;
    position: absolute;
    white-space: nowrap;
    top: -19px;
    cursor: pointer;
    z-index: 1;
  }
  .z_seek_time::after {
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    content: "";
    border-top: 6px solid rgba(0, 0, 0, 0.6);
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    z-index: 1;
  }
`;
export default Videos;
