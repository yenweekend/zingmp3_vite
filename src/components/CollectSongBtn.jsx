import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  addSongToCollection,
  deleteSongFromCollection,
} from "../apis/mongoose-api/song.api";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Popover, Modal } from "antd";
import { songCollectionSelector } from "../redux/collection/selector";
import { isLoginSelector } from "../redux/auth/selector";
import { useSelector } from "react-redux";
import toast from "../helpers/notification";
import icons from "../utils/icons";
const CollectSongBtn = ({ song, textWhite = true, currentSong = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const songCollection = useSelector(songCollectionSelector);
  const isLogin = useSelector(isLoginSelector);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addSongToCollection,
    onSuccess: (data) => {
      toast(`Đã thêm bài hát ${song.title} vào thư viện`);
      queryClient.invalidateQueries({ queryKey: ["songcollection"] });
    },
    onError: (error) => {
      toast(error.message);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteSongFromCollection,
    onSuccess: (data) => {
      toast(`Đã xóa bài hát khỏi sưu tập`);
      queryClient.invalidateQueries({ queryKey: ["songcollection"] });
    },
    onError: (error) => {
      toast(error.message);
    },
  });
  const handleCollectSong = useCallback(() => {
    if (isLogin) {
      const {
        title,
        artists,
        encodeId,
        duration,
        artistsNames,
        thumbnailM,
        album,
        isWorldWide,
        distributor,
      } = song;
      mutation.mutate({
        title,
        artists,
        encodeId,
        duration,
        artistsNames,
        thumbnailM,
        album,
        isWorldWide,
        distributor,
      });
    } else {
      setIsModalOpen(true);
    }
  }, [song, isLogin]);
  const handleDeleteSongFromCollection = useCallback(() => {
    deleteMutation.mutate(song.encodeId);
  }, [song]);
  const handleOk = (e) => {
    e.stopPropagation();
    setIsModalOpen(false);
  };
  const handleCancel = (e) => {
    e.stopPropagation();
    setIsModalOpen(false);
  };
  console.log(songCollection);
  return songCollection.some((item) => item.encodeId === song.encodeId) ? (
    <>
      <Popover title="Xóa khỏi thư viện" trigger="hover" color="#363636">
        <div
          className="w-9 h-9  rounded-[50%]  cursor-pointer flex items-center justify-center option  "
          onClick={handleDeleteSongFromCollection}
        >
          <icons.heartFill
            className={`text-[14px]  leading-[66%] ${
              currentSong ? "text-[#fff]" : " text-[--purple-primary]"
            }`}
          ></icons.heartFill>
        </div>
      </Popover>
    </>
  ) : (
    <>
      <Popover title="Thêm vào thư viện" trigger="hover" color="#363636">
        <div
          className="w-9 h-9  rounded-[50%]  cursor-pointer flex items-center justify-center option  invisible group-hover:visible"
          onClick={handleCollectSong}
        >
          <icons.heart
            className={`${
              textWhite ? " text-[--white]" : "primary-text"
            } text-[16px] `}
          ></icons.heart>
        </div>
      </Popover>
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className="playlist-create"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-[250px] pt-5">
            <img
              src="https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/login.png
  "
              className="w-full h-full object-cover"
            ></img>
          </div>
          <div className="text-[20px] font-bold primary-text">
            Đăng nhập Zing MP3
          </div>
          <Link
            to={"/auth/login"}
            className="px-[24px] py-[6px] bg-[--purple-primary] primary-text rounded-full text-[14px] font-bold mb-5 flex items-center gap-3"
          >
            Đi tới đăng nhập
            <icons.forward className="primary-text text-[16px]"></icons.forward>
          </Link>
        </div>
      </Modal>
    </>
  );
};

export default CollectSongBtn;
