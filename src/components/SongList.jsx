import React, { useRef, useState } from "react";
import { Popover } from "antd";
import icons from "../utils/icons";
import moment from "moment";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import SingerName from "./SingerName";
import Modal from "../components/Modals/Modal";
import { useDispatch } from "react-redux";
import { setQueueSong } from "../redux/queueSong/slice";
import generateUniqueId from "generate-unique-id";
import { useCallback } from "react";
import HISTORY_KEY, {
  deleteFromHistory,
  addToHistory,
} from "../helpers/history";
import CollectSongBtn from "./CollectSongBtn";
const SongList = ({
  song,
  children,
  isDelete = false,
  setData,
  deleteFromPlaylist = false,
  playlistId,
}) => {
  const dispatch = useDispatch();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const viewRef = useRef(null);
  const handlePlaySong = useCallback(() => {
    const id = generateUniqueId({
      length: 8,
      useLetters: true,
      useNumbers: true,
    });
    const songItem = {
      [id]: song,
    };
    dispatch(
      setQueueSong({
        queue_song: songItem,
        currentId: id,
        cursongEncodeId: song.encodeId,
      })
    );
    addToHistory(HISTORY_KEY.SONG, song);
  }, []);

  return (
    <>
      <div className="flex items-center  w-[50%]">
        {children}
        <div className=" w-10 h-10 rounded overflow-hidden relative flex-shrink-0">
          <LazyLoadImage
            className="w-full h-full object-cover"
            alt=""
            src={song?.thumbnailM}
            effect="blur"
          />
          <div
            className="absolute inset-0 flex items-center dark-alpha-50 justify-center invisible group-hover:visible cursor-pointer rounded "
            onClick={handlePlaySong}
          >
            <icons.play size="14" color="white"></icons.play>
          </div>
        </div>
        <div className=" ml-3  h-full">
          <span className="relative inline-block primary-text text-[14px] ">
            {song?.title}
          </span>
          <SingerName artists={song?.artists}></SingerName>
        </div>
      </div>
      <Link
        className=" w-0 flex-auto  text-[12px] secondary-text subtitle line-clamp-1"
        to={song?.album?.link.split(".")[0]}
      >
        {song?.album?.title}
      </Link>
      <div className="">
        <div className="flex gap-3  right-[10px] justify-end items-center ">
          <CollectSongBtn song={song} textWhite={false} />
          <Popover title="Xem thêm" trigger="hover" color="#363636">
            <div className="hidden group-hover:block">
              <div
                className="w-9 h-9  rounded-[50%]  cursor-pointer flex items-center justify-center option "
                ref={viewRef}
                onClick={() => {
                  setIsOpenModal((state) => !state);
                }}
              >
                <icons.more className="text-[14px] title leading-[66%] primary-text"></icons.more>
              </div>
            </div>
          </Popover>
          <div className="text-[12px]  secondary-text block group-hover:hidden  w-9">
            {moment.utc(song?.duration * 1000).format("mm:ss")}
          </div>
          {isDelete && (
            <Popover title="Xóa" trigger="hover" color="#363636">
              <div
                className="w-9 h-9  rounded-[50%]  cursor-pointer flex items-center justify-center  invisible group-hover:visible"
                onClick={() => {
                  const newState = deleteFromHistory(
                    HISTORY_KEY.SONG,
                    song.encodeId
                  );
                  setData(newState[HISTORY_KEY.SONG]);
                }}
              >
                <icons.close className="text-[14px] title leading-[66%] primary-text"></icons.close>
              </div>
            </Popover>
          )}
          <Modal
            isOpen={isOpenModal}
            targetRef={viewRef}
            onClose={() => setIsOpenModal(false)}
            data={song}
            isdeleteSongFromPlaylist={deleteFromPlaylist}
            playlistId={playlistId}
          ></Modal>
        </div>
      </div>
    </>
  );
};

export default SongList;
