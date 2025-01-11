import React, { useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import icons from "../../utils/icons";
import {
  addMutipleSongToPlaylist,
  deleteSongFromPlaylist,
} from "../../apis/mongoose-api/song.api";
import { getPlaylistCreated } from "../../apis/mongoose-api/playlist.api";
import toast from "../../helpers/notification";
const ModalAddSongToPlaylist = ({ mutipleSong, onClose, left = false }) => {
  const queryClient = useQueryClient();
  const {
    isPending,
    isError,
    error,
    data: playlistCreatedData,
  } = useQuery({
    queryKey: ["playlistcreated"],
    queryFn: getPlaylistCreated,
  });
  const mutation = useMutation({
    mutationFn: addMutipleSongToPlaylist,
    onSuccess: (response) => {
      toast(response.data.message);
      onClose();
    },
    onError: (error) => {
      toast(error.message);
      onClose();
    },
  });
  const handleAddMutipleSongInPlaylist = useCallback((id) => {
    mutation.mutate({ id: id, formData: { mutipleSong: mutipleSong } });
    onClose();
  }, []);
  if (isError) {
    console.log("tao modal add song to playlist");
  }

  return (
    <div className="flex-shrink-0  options-btn relative group ">
      <div className=" py-[10px] options-btn nav-text flex items-center justify-start px-[15px]  cursor-pointer relative group ">
        <div className="mr-[15px] flex items-center justify-center">
          <icons.pluscircle className=" "></icons.pluscircle>
        </div>
        <div className="flex items-center justify-between grow ">
          <span className="text-[14px] font-normal  ">Thêm vào playlist</span>
          <icons.arrowRight className=""></icons.arrowRight>
        </div>
      </div>
      <div
        className={`absolute playlist-private top-[-90px] w-[230px] py-[15px] rounded-[8px] primary-bg shadow-[0_2px_5px_0px_rgba(0,0,0,0.2)] h-[295px] z-[9999] group-hover:block hidden ${
          left ? "right-[270px]" : "left-[270px]"
        } `}
      >
        <div className="px-[15px]">
          <input
            type="text"
            name="playlist"
            placeholder="Tìm kiếm playlist"
            className="outline-none text-[--search-text] h-10 w-full rounded-[999px] text-[14px] bg-[--alpha-bg] px-[15px] leading-[1.5]  input placeholder-[--text-primary]"
            // onInput={handleInput}
            // ref={inputRef}
          ></input>
        </div>
        <div className=" py-[10px] nav-text flex items-center justify-start px-[15px] primary-bg cursor-pointer mt-[10px] hover:bg-[--alpha-bg] ">
          <div className="mr-[15px] flex items-center justify-center h-7 w-7 bg-blue-400 rounded-[12px] ">
            <icons.plus size={16} color="white"></icons.plus>
          </div>
          <span className="text-[14px] font-normal  whitespace-nowrap">
            Thêm playlist mới
          </span>
        </div>
        {playlistCreatedData.data.data.map((playlist) => (
          <div
            className=" py-[10px] options-btn nav-text flex items-center justify-start px-[15px] hover:bg-[--alpha-bg] cursor-pointer "
            key={playlist.encodeId}
            onClick={() => {
              handleAddMutipleSongInPlaylist(playlist._id);
            }}
          >
            <div className="mr-[15px] flex items-center justify-center">
              <icons.noteArt className="secodary-text text-[14px]"></icons.noteArt>
            </div>
            <span className="text-[14px] font-normal secondary-text ">
              {playlist.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModalAddSongToPlaylist;
