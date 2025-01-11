import React, { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "antd";
import { deletePlaylistCreated } from "../../apis/mongoose-api/playlist.api";
import toast from "../../helpers/notification";
const ModalDeletePlaylist = ({ isModalOpen, setIsModalOpen, playlistId }) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deletePlaylistCreated,
    onSuccess: () => {
      toast("Xóa playlist thành công");
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

  const handleDeletePlaylist = useCallback(
    (event) => {
      event.preventDefault();
      mutation.mutate(playlistId);
      setIsModalOpen(false);
    },
    [playlistId]
  );
  return (
    <Modal
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      className="playlist-delete"
    >
      <div className=" relative p-5">
        <h3 className="text-[18px] mb-[10px] font-bold title  primary-text">
          Xóa Playlist
        </h3>
        <span className="text-[14px] font-bold ">
          Playlist của bạn sẽ bị xóa khỏi thư viện cá nhân. Bạn có muốn xóa?
        </span>
        <div className="flex items-center justify-end mt-3">
          <div
            className="refuse py-[6px] px-[15px] rounded-full uppercase cursor-pointer border border-solid border-[--border-primary] bg-[--alpha-bg] mr-2 hover:opacity-60"
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            Không
          </div>
          <div
            className="accept py-[6px] px-[15px] rounded-full uppercase cursor-pointer bg-[--purple-primary] text-[--white] hover:opacity-60"
            onClick={handleDeletePlaylist}
          >
            Có
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDeletePlaylist;
