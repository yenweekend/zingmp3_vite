import React, { useRef, useState, useEffect } from "react";
import icons from "../utils/icons";
import { NavLink } from "react-router-dom";
import { Popover } from "antd";
import { ModalPlaylistCreated, ModalUpdatePlaylist } from ".";
import { useQuery } from "@tanstack/react-query";
import { getPlaylistCreated } from "../apis/mongoose-api/playlist.api";
import toast from "../helpers/notification";
import Spinner from "./Spinner";
const PlaylistPrivateList = () => {
  const { isPending, isError, error, data } = useQuery({
    queryKey: ["playlistcreated"],
    queryFn: getPlaylistCreated,
    enabled: false,
  });
  const viewRef = useRef(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModaUpdate, setIsOpenModalUpdate] = useState(false);
  if (isPending) {
    return <Spinner></Spinner>;
  }
  if (isError) {
    toast(error.message);
  }

  return (
    <ul className=" mt-3  pb-4 relative">
      {data.data.data.map((e) => (
        <li
          key={e.encodeId}
          className=" group cursor-pointer   flex items-center justify-between relative"
        >
          <NavLink
            className="flex items-center justify-between py-3 px-[21px] flex-auto"
            to={e.link}
          >
            <div className="flex items-start">
              <div
                className={` text-[14px] font-medium  text-[--navigation-text] group-hover:text-[--text-primary]`}
              >
                {e.title}
              </div>
            </div>
          </NavLink>
          <Popover title="Khác" trigger="hover" color="#363636">
            <div
              className="  flex items-center justify-center w-8 h-8  cursor-pointer hover:bg-white hover:bg-opacity-25 rounded-[50%] mx-2  relative "
              ref={viewRef}
              onClick={(e) => {
                setIsOpenModal((state) => !state);
              }}
            >
              <icons.more className="text-[20px] primary-text"></icons.more>
            </div>
          </Popover>
          <ModalPlaylistCreated
            onClose={() => setIsOpenModal(false)}
            targetRef={viewRef}
            isOpen={isOpenModal}
          >
            <div className="w-[280px] flex-shrink-0 ">
              <div className=" py-[10px] options-btn flex items-center justify-start px-[15px] nav-text cursor-pointer">
                <div className="mr-[15px] flex items-center justify-center">
                  <icons.addplaynow className=" "></icons.addplaynow>
                </div>
                <span className="text-[14px]  font-normal">
                  Thêm vào danh sách phát
                </span>
              </div>
              <div
                className=" py-[10px] options-btn flex items-center justify-start px-[15px] nav-text cursor-pointer"
                onClick={() => {
                  setIsOpenModalUpdate(true);
                }}
              >
                <div className="mr-[15px] flex items-center justify-center">
                  <icons.pencil className=" "></icons.pencil>
                </div>
                <span className="text-[14px]  font-normal">
                  Chỉnh sửa playlist
                </span>
              </div>
              <div className=" py-[10px] options-btn flex items-center justify-start px-[15px] nav-text cursor-pointer">
                <div className="mr-[15px] flex items-center justify-center">
                  <icons.bin className=" "></icons.bin>
                </div>
                <span className="text-[14px]  font-normal">Xóa playlist</span>
              </div>
            </div>
          </ModalPlaylistCreated>
          <ModalUpdatePlaylist
            playlist={e}
            isModalOpen={isOpenModaUpdate}
            setIsModalOpen={setIsOpenModalUpdate}
          />
        </li>
      ))}
    </ul>
  );
};

export default PlaylistPrivateList;
