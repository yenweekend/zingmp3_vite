import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  deleteMVFromCollection,
  addFavoriteMV,
} from "../apis/mongoose-api/mv.api";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Popover, Modal } from "antd";
import { songCollectionSelector } from "../redux/collection/selector";
import { isLoginSelector } from "../redux/auth/selector";
import { useSelector } from "react-redux";
import toast from "../helpers/notification";
import icons from "../utils/icons";
const CollectSongBtn = ({ videoData, mvcollection }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isLogin = useSelector(isLoginSelector);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addFavoriteMV,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videocollection"] });
      toast("Đã thêm MV vào thư viện");
    },
    onError: (error) => {
      toast(error.message);
    },
  });
  const mutationDeleteMV = useMutation({
    mutationFn: deleteMVFromCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videocollection"] });
      toast("Đã xóa MV vào thư viện");
    },
    onError: (error) => {
      toast(error.message);
    },
  });
  const handleCollectMV = useCallback(() => {
    if (isLogin) {
      const {
        title,
        artists,
        isWorldWide,
        thumbnailM,
        link,
        duration,
        encodeId,
        artist,
      } = videoData;
      mutation.mutate({
        title,
        artists,
        isWorldWide,
        thumbnailM,
        link,
        duration,
        encodeId,
        artist,
      });
    } else {
      setIsModalOpen(true);
    }
  }, [videoData, isLogin]);
  const handleDeleteMVFromCollection = useCallback(() => {
    mutationDeleteMV.mutate(videoData.encodeId);
  });

  const handleOk = (e) => {
    e.stopPropagation();
    setIsModalOpen(false);
  };
  const handleCancel = (e) => {
    e.stopPropagation();
    setIsModalOpen(false);
  };
  return mvcollection.some((mv) => mv.encodeId === videoData.encodeId) ? (
    <Popover
      title="Xóa khỏi thư viện"
      trigger={"hover"}
      color="#363636"
      placement="bottom"
    >
      <div
        className="icon_div h-10 w-10 rounded-[50%] flex items-center justify-center"
        onClick={() => {
          handleDeleteMVFromCollection();
        }}
      >
        <icons.heartFill
          className={"text-[--purple-primary] text-[20px]"}
        ></icons.heartFill>
      </div>
    </Popover>
  ) : (
    <>
      <Popover
        title="Thêm vào thư viện"
        trigger={"hover"}
        color="#363636"
        placement="bottom"
      >
        <div
          className="icon_div h-10 w-10 rounded-[50%] flex items-center justify-center"
          onClick={() => {
            handleCollectMV();
          }}
        >
          <icons.heart className={"text-[#fff] text-[20px]"}></icons.heart>
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
