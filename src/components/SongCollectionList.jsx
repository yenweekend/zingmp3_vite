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
import HISTORY_KEY, { addToHistory } from "../helpers/history";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSongFromCollection } from "../apis/mongoose-api/song.api";
import toast from "../helpers/notification";
const SongCollectionList = ({ song, children }) => {
  const queryClient = useQueryClient();
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
  const mutation = useMutation({
    mutationFn: deleteSongFromCollection,
    onSuccess: (data) => {
      console.log(data);
      toast(`Đã xóa bài hát khỏi sưu tập`);
      queryClient.invalidateQueries({ queryKey: ["songcollection"] });
    },
    onError: (error) => {
      toast(error.message);
    },
  });
  const handleCollectSong = useCallback(() => {
    mutation.mutate(song.encodeId);
  }, [song]);
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
      <div className=" pr-[40px]">
        <div className="flex gap-3  right-[10px] justify-end ">
          <Popover
            title="Phát cùng lời bài hát"
            trigger="hover"
            color="#363636"
          >
            <div className="group-hover:block hidden">
              <div className="w-9 h-9  rounded-[50%]  cursor-pointer flex items-center justify-center   option">
                <icons.mic className="text-[14px] title leading-[66%] primary-text"></icons.mic>
              </div>
            </div>
          </Popover>
          <Popover title="Xóa khỏi thư viện" trigger="hover" color="#363636">
            <div
              className="w-9 h-9  rounded-[50%]  cursor-pointer flex items-center justify-center    option"
              onClick={handleCollectSong}
            >
              <icons.heartFill className="text-[14px]  leading-[66%]  text-[--purple-primary]"></icons.heartFill>
            </div>
          </Popover>
          <Popover title="Xem thêm" trigger="hover" color="#363636">
            <div
              className="w-9 h-9  rounded-[50%]  cursor-pointer  option hidden group-hover:block"
              ref={viewRef}
              onClick={() => {
                setIsOpenModal((state) => !state);
              }}
            >
              <div className="flex items-center justify-center w-full h-full">
                <icons.more className="text-[14px] title leading-[66%] primary-text"></icons.more>
              </div>
            </div>
          </Popover>
          <div className="text-[12px]  secondary-text  group-hover:invisible flex justify-center items-center  group-hover:hidden w-9 ">
            {moment.utc(song?.duration * 1000).format("mm:ss")}
          </div>

          <Modal
            isOpen={isOpenModal}
            targetRef={viewRef}
            onClose={() => setIsOpenModal(false)}
            data={song}
          ></Modal>
        </div>
      </div>
    </>
  );
};

export default SongCollectionList;
