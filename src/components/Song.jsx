import React, { useCallback, useRef, useState } from "react";
import SingerName from "./SingerName";
import icons from "../utils/icons";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Link } from "react-router-dom";
import { Popover } from "antd";
import Modal from "./Modals/Modal";
import moment from "moment";
import { useDispatch } from "react-redux";
import { setQueueSong } from "../redux/queueSong/slice";
import generateUniqueId from "generate-unique-id";
import CollectSongBtn from "./CollectSongBtn";
const Song = ({
  dimension,
  fontSize,
  heart = true,
  view = true,
  uppercase = false,
  data,
  duration = false,
  children,
  title = false,
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
      [id]: data,
    };
    dispatch(
      setQueueSong({
        queue_song: songItem,
        currentId: id,
        cursongEncodeId: data.encodeId,
      })
    );
  }, []);
  return (
    <div className=" flex  items-center  group  relative cursor-pointer  rounded p-[10px]  w-full song-info ">
      {children}
      <div className="flex items-center  w-[50%] flex-shrink flex-grow ">
        <div
          className=" rounded overflow-hidden relative flex-shrink-0"
          style={{
            width: `${dimension}px`,
            height: `${dimension}px`,
          }}
        >
          <LazyLoadImage
            alt=""
            effect="blur"
            src={data.thumbnailM}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute  inset-0 flex items-center justify-center invisible group-hover:visible cursor-pointer dark-alpha-50"
            onClick={handlePlaySong}
          >
            <icons.play className="icon_btn text-[16px] text-white"></icons.play>
          </div>
        </div>
        <div className=" ml-3 w-[100%]">
          {title && <span className="secondary-text text-[12px]">Bài hát</span>}
          <div
            className={`max-w-[100%] text-[14px]  flex items-center  }`}
            style={{
              fontSize: `${fontSize}px`,
            }}
          >
            <Link
              to={"/"}
              className={` w-0 flex-auto  line-clamp-1  primary-text ${
                uppercase ? "uppercase" : ""
              }`}
            >
              {data.title}
            </Link>
          </div>
          <SingerName artists={data.artists}></SingerName>
        </div>
      </div>

      <div className="hidden group-hover:block group-hover:pl-[30px]">
        <div className="flex gap-3  right-[10px] justify-end ">
          {heart && <CollectSongBtn song={data} textWhite={false} />}
          {view && (
            <>
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
                data={data}
              ></Modal>
            </>
          )}
        </div>
      </div>
      {duration && (
        <div className="text-[12px]  secondary-text block group-hover:hidden pl-[100px]">
          {moment.utc(data.duration * 1000).format("mm:ss")}
        </div>
      )}
    </div>
  );
};
export default Song;
