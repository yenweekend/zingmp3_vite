import React, { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "antd";
import generateUniqueId from "generate-unique-id";
import { createPlaylist } from "../../apis/mongoose-api/playlist.api";
import diacritics from "diacritics";
import toast from "../../helpers/notification";
const ModalCreateNewPlaylist = ({ isModalOpen, setIsModalOpen }) => {
  const queryClient = useQueryClient();
  const [playlistName, setPlaylistName] = useState({ title: "" });
  const mutation = useMutation({
    mutationFn: createPlaylist,
    onSuccess: () => {
      toast("Tạo Playlist mới thành công");
      queryClient.invalidateQueries({ queryKey: ["playlistcreated"] });
    },
    onError: (error) => {
      toast(error.message);
    },
  });

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleChange = useCallback((e) => {
    setPlaylistName({ ...playlistName, [e.target.name]: e.target.value });
  }, []);
  const handleCreatePlaylist = useCallback(
    (event) => {
      event.preventDefault();
      if (playlistName.title.trim().length === 0) {
        return null;
      }
      const id = generateUniqueId({
        length: 8,
        useLetters: true,
        useNumbers: true,
      });
      const strWithoutDiacritics = diacritics.remove(playlistName.title);
      const upperID = id.toUpperCase();
      const link = `/playlist/${strWithoutDiacritics.replaceAll(
        " ",
        "-"
      )}/${upperID}`;
      mutation.mutate({
        ...playlistName,
        encodeId: upperID,
        link,
        thumbnailM: "https://photo-zmp3.zmdcdn.me/album_default.png",
      });
      setIsModalOpen(false);
    },
    [playlistName]
  );
  return (
    <Modal
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      className="playlist-create"
    >
      <div className="form w-[330px] h-[300px]  relative p-5">
        <h3 className="text-[18px] mb-[10px] font-bold title text-center primary-text">
          Tạo Playlist Mới
        </h3>
        <form>
          <div className="flex ">
            <input
              type="text"
              name="title"
              placeholder="Nhập tên playlist"
              className="outline-none pl-[20px] border-[--border-primary] border border-solid bg-[--alpha-bg] rounded-full h-[40px] leading-[1.5] flex-auto text-[--search-text] placeholder-[--navigation-text]"
              onChange={handleChange}
              value={playlistName.title}
            ></input>
          </div>
          <div className=" flex justify-between items-center pt-5 px-[15px]">
            <div>
              <h3 className="primary-text text-[14px] font-medium">
                Công khai
              </h3>
              <h3 className="text-[--secondary-text-color] text-[12px]">
                Mọi người có thể nhìn thấy playlist này
              </h3>
            </div>
            <div className="w-6 h-[15px] bg-[--purple-bg] cursor-pointer rounded-[14px] relative">
              <div className="circle w-[13px] h-[13px] rounded-[50%] bg-white absolute top-[50%] translate-y-[-50%] left-[1px]"></div>
            </div>
          </div>
          <div className=" flex justify-between items-center pt-5 px-[15px]">
            <div>
              <h3 className="primary-text text-[14px] font-medium">
                Phát ngẫu nhiên
              </h3>
              <h3 className="text-[--secondary-text-color] text-[12px]">
                Luôn phát ngẫu nhiên tất cả bài hát
              </h3>
            </div>
            <div className="w-6 h-[15px] bg-[--purple-bg] cursor-pointer rounded-[14px] relative">
              <div className="circle w-[13px] h-[13px] rounded-[50%] bg-white absolute top-[50%] translate-y-[-50%] left-[1px]"></div>
            </div>
          </div>
          <button
            type="button"
            className={`w-full text-center mt-5 py-2 rounded-full bg-[--purple-primary] primary-text uppercase text-[14px] font-normal ${
              playlistName.title.trim().length === 0
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
            onClick={handleCreatePlaylist}
          >
            Tạo Mới
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default ModalCreateNewPlaylist;