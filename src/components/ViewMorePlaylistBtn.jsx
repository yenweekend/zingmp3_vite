import React, { useRef, useState } from "react";
import { Popover } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import ModalPlaylist from "./Modals/ModalPlaylist";
import { getAlbum } from "../apis/zing-api/album.api";
import toast from "../helpers/notification";
import icons from "../utils/icons";
import { queueSongSelector } from "../redux/queueSong/selector";
import { useSelector } from "react-redux";
import generateUniqueId from "generate-unique-id";
import { setSongId, putQueueSong } from "../redux/queueSong/slice";
const ViewMorePlaylistBtn = ({ playlistData, textWhite = true }) => {
  const queueSong = useSelector(queueSongSelector);
  const viewRef = useRef(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const mutation = useMutation({
    mutationFn: getAlbum,
    onSuccess: (data) => {
      const itemMap = data.data.data.song.items.reduce((initital, result) => {
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
      if (Object.keys(queueSong).length === 0) {
        const firstSongKey = itemMap[Object.keys(itemMap)[0]];
        dispatch(
          setSongId({
            songId: Object.keys(itemMap)[0],
            cursongEncodeId: firstSongKey.encodeId,
          })
        );
      }
      dispatch(putQueueSong({ queue_song: itemMap }));
      toast(`Đã thêm playlist ${playlistData.title} vào danh sách phát`);
    },
    onError: (error) => {
      toast("Thêm vào danh sách phát không thành công !");
    },
  });
  return (
    <>
      <Popover title="Xem thêm" trigger="hover" color="#363636">
        <div
          className="  flex items-center justify-center w-8 h-8  cursor-pointer hover:bg-white hover:bg-opacity-25 rounded-[50%]  group/visible relative "
          onClick={(event) => {
            event.stopPropagation();
            setIsOpenModal((state) => !state);
          }}
          ref={viewRef}
        >
          <icons.more
            className={`${
              textWhite ? " text-[--white]" : "primary-text"
            } text-[20px]`}
          ></icons.more>
        </div>
      </Popover>
      <ModalPlaylist
        onClose={() => setIsOpenModal(false)}
        targetRef={viewRef}
        isOpen={isOpenModal}
      >
        <div className="w-[280px] flex-shrink-0 ">
          <div
            className=" py-[10px] options-btn flex items-center justify-start px-[15px] nav-text cursor-pointer"
            onClick={(event) => {
              event.preventDefault();
              mutation.mutate(playlistData.encodeId);
              setIsOpenModal(false);
            }}
          >
            <div className="mr-[15px] flex items-center justify-center">
              <icons.addplaynow className=" "></icons.addplaynow>
            </div>
            <span className="text-[14px]  font-normal">
              Thêm vào danh sách phát
            </span>
          </div>
        </div>
      </ModalPlaylist>
    </>
  );
};

export default ViewMorePlaylistBtn;
