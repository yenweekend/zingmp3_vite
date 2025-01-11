import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import icons from "../utils/icons";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Popover } from "antd";
import {
  currentIdSelector,
  queueSongSelector,
} from "../redux/queueSong/selector";
import { useDispatch, useSelector } from "react-redux";
import { SongQueue } from "../components";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import useClickAway from "../hooks/useClickAway";
import { ModalAddSongToPlaylist } from "../components";
import { resetQueueSong } from "../redux/queueSong/slice";
import toast from "../helpers/notification";
const RightSideBar = ({ appear }) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const viewRef = useRef();
  const ref = useRef();
  useClickAway(ref, viewRef, () => {
    setIsModalOpen(false);
  });
  const queueSong = useSelector(queueSongSelector);
  const currentId = useSelector(currentIdSelector);
  const nextSong = useMemo(() => {
    const currentSongIndex = Object.keys(queueSong).indexOf(currentId);
    const nextSongId = Object.keys(queueSong)[currentSongIndex + 1];
    return queueSong[`${nextSongId}`];
  }, [currentId, queueSong]);
  const handleDeleteQueueSong = useCallback(() => {
    dispatch(resetQueueSong());
    toast("Đã xóa danh sách phát");
  }, []);
  return createPortal(
    <WrappedRightBar>
      <div
        className={`w-[330px]  fixed top-0 right-0  shrink-0 grow-1 basis-0 transition duration-300 ease-linear bg-[--queue-player-popup-bg] bottom-[90px]  z-[80] ${
          appear ? "translate-x-0" : "translate-x-[100%]"
        }`}
      >
        <div className="w-full h-full rightbar flex flex-col ">
          <div className=" flex items-center py-[14px] px-2 justify-between">
            <div className="p-[3px]  rounded-[23px] flex grow shrink level_left bg-[--alpha-bg]">
              <div
                className={`py-[5px] rounded-[20px] flex justify-center items-center grow shrink-0 basis-auto  cursor-pointer transition duration-100 ease-linear bg-[--tab-active-bg]`}
              >
                <h3
                  className={`text-[12px]  text-[--navigation-text] hover:text-[--text-item-hover]`}
                >
                  Danh sách phát
                </h3>
              </div>
              <div
                className={`py-[5px] rounded-[20px] flex justify-center items-cente grow shrink-0 basis-auto  cursor-pointer transition duration-100 ease-linear
           `}
              >
                <h3
                  className={`  text-[12px]   text-[--navigation-text] hover:text-[--text-item-hover]`}
                >
                  Nghe gần đây
                </h3>
              </div>
            </div>
            <div className="flex items-center flex-end grow-1 grow-0 shrink-0 basis-auto ">
              <Popover
                title="Hẹn giờ dừng nhạc"
                trigger="hover"
                color="#363636"
                placement="bottom"
              >
                <div className="w-8 h-8 rounded-[50%]  flex justify-center items-center ml-2 icon_wrapper cursor-pointer">
                  <icons.alarm className="text-[16px] primary-text"></icons.alarm>
                </div>
              </Popover>
              <Popover
                title="Khác"
                trigger="hover"
                color="#363636"
                placement="bottom"
              >
                <div
                  className="w-8 h-8 rounded-[50%]  flex justify-center items-center ml-2 icon_wrapper cursor-pointer relative"
                  ref={viewRef}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen((state) => !state);
                  }}
                >
                  <icons.more className="text-[16px] primary-text"></icons.more>
                </div>
                {isModalOpen && (
                  <div
                    ref={ref}
                    className="w-[300px]  primary-bg rounded-[8px]  fixed top-[40px] right-0 z-[50] py-[6px]"
                  >
                    <div>
                      <div className="  text-[14px] cursor-pointer nav-text hover:bg-[--alpha-bg] ">
                        <div
                          className="h-11 py-[12px] px-[10px] flex items-center rounded-[4px]  justify-between text-inherit"
                          onClick={handleDeleteQueueSong}
                        >
                          <div className="flex items-center text-inherit">
                            <div className="mr-3 text-inherit">
                              <icons.bin className="text-[20px]  icons text-inherit"></icons.bin>
                            </div>
                            <span className="whitespace-nowrap  text-[14px] font-normal cursor-pointer text-inherit">
                              Xóa danh sách phát
                            </span>
                          </div>
                        </div>
                      </div>
                      <ModalAddSongToPlaylist
                        mutipleSong={Object.values(queueSong)}
                        left={true}
                        onClose={() => {
                          setIsModalOpen(false);
                        }}
                      ></ModalAddSongToPlaylist>
                    </div>
                  </div>
                )}
              </Popover>
            </div>
          </div>

          <>
            <div className="relative flex-grow flex-shrink">
              <div
                className="overflow-y-auto  absolute inset-0 overflow-hidden max-h-[calc(100vh-152px)] scroll-bar-custom  top-0 left-0 bottom-0 right-[-6px]  "
                // onScroll={handleScroll}
              >
                <div className="absolute px-2 inset-0">
                  <div className="w-full pr-2">
                    <>
                      {Object.keys(queueSong).map((id, index) =>
                        id === currentId ? (
                          <>
                            {" "}
                            <div className="z-[2] sticky top-0 sticky_wrap">
                              <div className="">
                                <SongQueue
                                  key={id}
                                  data={{
                                    ...queueSong[`${id}`],
                                    songId: id,
                                  }}
                                  dimension={40}
                                  stateSong="current"
                                ></SongQueue>
                              </div>
                              {nextSong !== undefined && (
                                <div className="py-[15px] px-2 bg-third">
                                  <h3 className="text-[14px] font-semibold primary-text">
                                    Tiếp theo
                                  </h3>
                                  {nextSong.currentPlaylist && (
                                    <div className="flex items-center">
                                      <span className="text-[14px] whitespace-nowrap text-[--text-muted]">
                                        Từ playlist
                                      </span>
                                      <div className="flex items-center flex-auto flex-shrink-0 ml-[5px] cursor-pointer">
                                        <Link
                                          to={
                                            nextSong.currentPlaylist.link.split(
                                              "."
                                            )[0]
                                          }
                                          className="w-0 flex-auto line-clamp-1 text-[--link-text-hover] font-medium text-[14px]"
                                        >
                                          {nextSong.currentPlaylist.title}
                                        </Link>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </>
                        ) : Object.keys(queueSong).indexOf(currentId) <
                          index ? (
                          <SongQueue
                            dimension={40}
                            data={{ ...queueSong[`${id}`], songId: id }}
                            key={id}
                            stateSong="next"
                          ></SongQueue>
                        ) : (
                          <SongQueue
                            dimension={40}
                            data={{ ...queueSong[`${id}`], songId: id }}
                            key={id}
                            stateSong="prev"
                          ></SongQueue>
                        )
                      )}
                    </>

                    <div className="p-2 flex items-center justify-between">
                      <div className="">
                        <h3 className="text-[14px] font-bold primary-text">
                          Đã tắt tự động phát
                        </h3>
                        <span className="text-secondary text-[12px]  text-[--text-muted]">
                          Bật lên để phát tiếp các bài hát gợi í
                        </span>
                      </div>
                      <div className="px-3">
                        <div
                          className={`w-6 rounded-[999px] h-[15px] relative cursor-pointer bg_purple
                          `}
                        >
                          <div
                            className={`w-[15px] h-full rounded-[50%] bg-white top-0 left-0 bottom-0 translate-x-[9px]
                             transiton-all duration-200 ease-linear `}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="track_vertical absolute w-[4px] right-[2px] top-[2px] bottom-[2px] z-[100] bg-transparent">
                <div className="w-full h-16 block thumb_vertical"></div>
              </div>
            </div>
          </>
        </div>
      </div>
    </WrappedRightBar>,
    document.querySelector("#now-playing-bar")
  );
};
const WrappedRightBar = styled.div`
  .scroll_bar_theme::-webkit-scrollbar {
    width: 5px;
    background-color: var(--queue-player-popup-bg);
    border-radius: 4px;
  }
  .scroll_bar_theme::-webkit-scrollbar-thumb {
    background-color: var(--alpha-bg);
    border-radius: 4px;
  }
  .bg_song_item_hover:hover {
    background-color: var(--alpha-bg);
  }
  .title_current_song {
    color: hsla(0, 0%, 100%, 0.6);
  }
  .bg_purple {
    background-color: var(--purple-primary);
  }
  .sticky_wrap {
    background-color: var(--queue-player-popup-bg);
  }
  .level_left {
    background-color: var(--alpha-bg);
  }
  .text_hover {
    color: var(--text-item-hover);
  }
  .text_leave {
    color: var(--navigation-text);
  }
  .active_bg {
    background-color: var(--tab-active-bg);
  }
  .icon {
    color: var(--text-primary);
  }
  .icon_wrapper {
    background-color: var(--alpha-bg);
  }
`;
export default RightSideBar;
