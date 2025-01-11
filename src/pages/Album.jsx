import React, { useCallback, useEffect, useRef, useState } from "react";
import icons from "../utils/icons";
import moment from "moment";
import { useParams } from "react-router-dom";
import { Popover } from "antd";
import { useQuery } from "@tanstack/react-query";
import SingerName from "../components/SingerName";
import { getAlbum } from "../apis/zing-api/album.api";
import { SongList, Loading, ModalAddSongToPlaylist } from "../components";
import ModalPlaylist from "../components/Modals/ModalPlaylist";
import generateUniqueId from "generate-unique-id";
import { putQueueSong } from "../redux/queueSong/slice";
import { useDispatch } from "react-redux";
import { CollectPlaylistBtn, ViewMorePlaylistBtn } from "../components";
const Album = () => {
  const dispatch = useDispatch();
  const viewRef = useRef(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { id } = useParams();
  const [songSelect, setSongSelect] = useState([]);
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["album", id],
    queryFn: () => getAlbum(id),
    enabled: !!id,
  });
  const handleSelectOne = useCallback((event, song) => {
    setSongSelect((state) => {
      if (event.target.checked) {
        // Add song to the selection
        return [...state, song];
      } else {
        // Remove song from the selection
        return state.filter((item) => item.encodeId !== song.encodeId);
      }
    });
  }, []);
  const handleSelectAll = useCallback(
    (event) => {
      if (data) {
        if (event.target.checked) {
          setSongSelect(data.data.data.song.items);
        } else {
          setSongSelect([]);
        }
      }
    },
    [data]
  );
  const handleAddMutipleSongToQueue = useCallback(() => {
    if (data) {
      const itemMap = songSelect.reduce((initital, result) => {
        const id = generateUniqueId({
          length: 8,
          useLetters: true,
          useNumbers: true,
        });
        initital[id] = {
          ...result,
          currentPlaylist: {
            title: data.data.data.title,
            link: data.data.data.link.split(".")[0],
          },
        };
        return initital;
      }, {});
      dispatch(putQueueSong({ queue_song: itemMap }));
      toast(`Đã thêm các bài hát vào danh sách phát`);
    }
  }, [data, songSelect]);
  if (isPending) {
    return <Loading />;
  }
  if (isError) {
    return <span>Error: {error.message}</span>;
  }
  return (
    <div className="pt-[40px]">
      <div className={`flex max-1200:flex-col `}>
        <div className={` pb-[30px] w-[300px] max-1200:w-full max-1200:flex  `}>
          <div
            className={` relative h-[300px] w-full "
               group overflow-hidden rounded-lg max-1200:w-[200px] max-1200:h-[200px]  max-1200:mr-[20px]`}
          >
            <img
              src={data.data.data?.thumbnailM}
              className="w-full h-full object-cover group-hover:scale-125  transition-all duration-1000 flex-shrink-0  ease-linear "
            ></img>
            <div className="absolute inset-0  flex items-center justify-center invisible group-hover:visible group-hover:bg-[rgba(0,0,0,0.4)] duration-300 transition-all ease-linear">
              <div className="cursor-pointer  border-[2px] border-white rounded-[50%] ml-[3px] w-12 h-12 px-1 grid place-items-center ">
                <icons.playsharp className="text-[28px] text-white"></icons.playsharp>
              </div>
            </div>
          </div>
          <div
            className={`flex flex-col items-center max-1200:items-start
                    `}
          >
            <h3
              className={`primary-text text-[20px] font-bold text-center mt-3 max-1200:mt-0`}
            >
              {data.data.data?.title}
            </h3>
            <div className={`text-center `}>
              <span className="text-[12px] text-inherit capitalize secondary-text">
                cập nhật:
              </span>
              <span className="text-[12px] text-inherit leading-[1.75] secondary-text">
                {moment
                  .unix(data.data.data?.contentLastUpdate)
                  .format("DD/MM/YYYY")}
              </span>
            </div>
            <div
              className={` text-[12px]  leading-[1.75]  flex items-center justify-center
                      `}
            >
              <SingerName artists={data.data.data?.artists}></SingerName>
            </div>
            <div
              className={`text-[12px] text-center
                      leading-[1.75]  secondary-text`}
            >
              {`${Math.floor(data.data.data?.like / 1000)}K Người Yêu Thích`}
            </div>
            {data.data.data?.sortDescription && (
              <div
                className={`description  mb-9 max-1200:mb-[10px] max-1200:mt-[16px] max-1200:block hidden`}
              >
                <span className="text-[14px] leading-[1.5] secondary-text">
                  Lời tựa
                </span>
                <span className=" pl-1 text-[14px] primary-text">
                  {data.data.data.sortDescription}
                </span>
              </div>
            )}
            <div className="max-1200:flex max-1200:items-center max-1200:gap-4 mt-[20px] max-1200:mt-[10px] ">
              <div className=" cursor-pointer purple-bg rounded-full text-[--white] flex items-center gap-3 py-[9px] px-[24px]">
                <icons.play></icons.play>
                <span className="text-inherit uppercase text-[16px]">
                  phát ngẫu nhiên
                </span>
              </div>
              <div className="flex items-center gap-3 mt-[10px] max-1200:mt-0 justify-center">
                <CollectPlaylistBtn
                  playlistData={data.data.data}
                  textWhite={false}
                />
                <ViewMorePlaylistBtn
                  playlistData={data.data.data}
                  textWhite={false}
                />
              </div>
            </div>
          </div>
          <div className={``}></div>
        </div>
        <div className={` flex-1 ml-[30px] max-1200:ml-0`}>
          <div className={`description  mb-9 max-1200:hidden block`}>
            <span className="text-[14px] leading-[1.5] secondary-text">
              Lời tựa
            </span>
            <span className=" pl-1 text-[14px] primary-text">
              {data.data.data?.sortDescription}
            </span>
          </div>
          <div className="list mb-[10px]">
            <div className="p-[10px] flex justify-between items-center song-list">
              <div className="flex items-center w-[50%]">
                {songSelect.length > 0 ? (
                  <div className="flex items-center justify-center mr-[10px]">
                    <label
                      htmlFor="song"
                      className="flex items-center justify-center checkbox relative cursor-pointer "
                    >
                      <input
                        type="checkbox"
                        name="song"
                        className="p-[6px] cursor-pointer relative"
                        onChange={handleSelectAll}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="border border-gray-400 w-4 h-4 rounded-[4px] text-center flex items-center justify-center cursor-pointer mr-[10px]">
                    <icons.sort className="leading-[66%] text-[16px] secondary-text"></icons.sort>
                  </div>
                )}
                {songSelect.length > 0 ? (
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center gap-2 border-[--border-box] border-solid border rounded-full px-[10px] py-[2px] cursor-pointer"
                      onClick={handleAddMutipleSongToQueue}
                    >
                      <icons.circlesolid className="text-[--text-secondary]"></icons.circlesolid>
                      <span className="uppercase text-[10px] secondary-text">
                        Thêm vào danh sách phát
                      </span>
                    </div>
                    <div
                      className="h-[22px] w-[22px] rounded-full border-[--border-box] border-solid border flex items-center justify-center cursor-pointer relative"
                      ref={viewRef}
                      onClick={() => {
                        setIsOpenModal((state) => !state);
                      }}
                    >
                      <icons.more className="text-[--text-secondary]"></icons.more>
                    </div>
                    <ModalPlaylist
                      onClose={() => setIsOpenModal(false)}
                      targetRef={viewRef}
                      isOpen={isOpenModal}
                    >
                      <div className="w-[280px]">
                        <ModalAddSongToPlaylist
                          mutipleSong={songSelect}
                          onClose={() => setIsOpenModal(false)}
                        />
                      </div>
                    </ModalPlaylist>
                  </div>
                ) : (
                  <div className=" text-[12px]  font-medium secondary-text">
                    BÀI HÁT
                  </div>
                )}
              </div>
              <div className="w-0 flex-auto text-[12px] font-medium  secondary-text">
                ALBUM
              </div>
              <div className="text-[12px] font-medium  secondary-text">
                THỜI GIAN
              </div>
            </div>
            <div className="album">
              {data.data.data?.song?.items.map((song) => (
                <div
                  className={` flex justify-between items-center h-[60px] group  relative cursor-pointer song-info  rounded p-[10px] song-list ${
                    songSelect.some((item) => item.encodeId === song.encodeId)
                      ? "bg-[--alpha-bg]"
                      : ""
                  }`}
                  key={song.encodeId}
                >
                  <div
                    className={` absolute top-[50%] translate-y-[-50%] w-[34px] h-[34px] ${
                      songSelect.some(
                        (item) => item.encodeId === song.encodeId
                      ) || songSelect.length > 0
                        ? "block"
                        : "hidden group-hover:block"
                    } left-0 `}
                  >
                    <div className="flex items-center justify-center w-full h-full">
                      <label
                        htmlFor="song"
                        className="flex items-center justify-center checkbox relative cursor-pointer "
                      >
                        <input
                          checked={songSelect.some(
                            (item) => item.encodeId === song.encodeId
                          )}
                          type="checkbox"
                          name="song"
                          className="p-[6px] cursor-pointer relative"
                          value={song.encodeId}
                          onChange={(event) => {
                            handleSelectOne(event, song);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  <SongList song={song}>
                    <div
                      className={`  w-4 h-4 rounded-[4px] text-center flex items-center justify-center cursor-pointer mr-[10px]  visible group-hover:invisible ${
                        songSelect.some(
                          (item) => item.encodeId === song.encodeId
                        ) || songSelect.length > 0
                          ? "invisible"
                          : ""
                      }`}
                    >
                      <icons.notemusic className="leading-[66%] text-[16px] secondary-text"></icons.notemusic>
                    </div>
                  </SongList>
                </div>
              ))}
            </div>
          </div>
          <div className="secondary-text">
            <div className="text-interhit ">
              <span className="text-inherit mr-2 text-[13px] font-medium ">
                {data.data.data?.song?.total}
                bài hát{" "}
              </span>
              <div className="inline-block w-[4px] h-[4px] rounded-[50%] secondary-bg top-[50%] translate-y-[-50%] left-0"></div>
              <span className="text-inherit ml-2 text-[13px] font-medium">
                {moment
                  .utc(
                    moment
                      .duration(data.data.data?.song.totalDuration, "seconds")
                      .as("milliseconds")
                  )
                  .format("H [giờ] m [phút]")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Album;
