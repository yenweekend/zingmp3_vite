import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { isLoginSelector } from "../redux/auth/selector";
import toast from "../helpers/notification";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPlaylistToCollection } from "../apis/mongoose-api/playlist.api";
import { Popover, Modal } from "antd";
import icons from "../utils/icons";
import { playlistCollectionSelector } from "../redux/collection/selector";
import { deletelaylistFromCollection } from "../apis/mongoose-api/playlist.api";
import { Link } from "react-router-dom";
const CollectPlaylistBtn = ({ playlistData, textWhite = true }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const playlistCollection = useSelector(playlistCollectionSelector);
  const isLogin = useSelector(isLoginSelector);
  const deleteMutation = useMutation({
    mutationFn: deletelaylistFromCollection,
    onSuccess: (data) => {
      toast(`Đã xóa playlist ${playlistData.title} khỏi thư viện`);
      queryClient.invalidateQueries({ queryKey: ["playlistcollection"] });
    },
    onError: (error) => {
      toast(error.message);
    },
  });
  const handleDeletePlaylistFromCollection = useCallback((event) => {
    event.stopPropagation();
    deleteMutation.mutate(playlistData.encodeId);
  }, []);
  const collectMutation = useMutation({
    mutationFn: addPlaylistToCollection,
    onSuccess: (response) => {
      toast(`Đã thêm ${playlistData.title} vào thư viện`);
      queryClient.invalidateQueries({ queryKey: ["playlistcollection"] });
    },
    onError: (error) => {
      toast(error.message);
    },
  });
  const handleCollectPlaylist = useCallback(
    (event) => {
      event.stopPropagation();

      if (isLogin) {
        const { title, artists, encodeId, thumbnailM, link } = playlistData;
        collectMutation.mutate({
          title,
          artists,
          encodeId,
          thumbnailM,
          link,
        });
      } else {
        setIsModalOpen(true);
      }
    },
    [playlistData, isLogin]
  );
  const handleOk = (e) => {
    e.stopPropagation();
    setIsModalOpen(false);
  };
  const handleCancel = (e) => {
    e.stopPropagation();
    setIsModalOpen(false);
  };

  return playlistCollection.some(
    (item) => item.encodeId === playlistData.encodeId
  ) ? (
    <Popover title="Xóa khỏi thư viện" trigger="hover" color="#363636">
      <div
        className={`  flex items-center justify-center w-8 h-8  cursor-pointer hover:bg-white hover:bg-opacity-25 rounded-[50%]  group/visible relative `}
        onClick={handleDeletePlaylistFromCollection}
      >
        <icons.heartFill className="text-[16px] text-[--purple-primary]"></icons.heartFill>
      </div>
    </Popover>
  ) : (
    <>
      <Popover title="Thêm vào thư viện" trigger="hover" color="#363636">
        <div
          className={`  flex items-center justify-center w-8 h-8  cursor-pointer hover:bg-white hover:bg-opacity-25 rounded-[50%]  group/visible relative `}
          onClick={handleCollectPlaylist}
        >
          <icons.heart
            className={`${
              textWhite ? " text-[--white]" : "primary-text"
            } text-[16px]`}
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

export default CollectPlaylistBtn;
