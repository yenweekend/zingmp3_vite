import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPlaylistCreated,
  createPlaylist,
} from "../../apis/mongoose-api/playlist.api";
import toast from "../../helpers/notification";
import { Loading, ModalCreateNewPlaylist } from "../../components";
import { PlaylistPrivateItem } from "../../components";
import icons from "../../utils/icons";
const PlaylistOwner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { isPending, isError, error, data } = useQuery({
    queryKey: ["playlistcreated"],
    queryFn: getPlaylistCreated,
  });
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
  // const handleCreatePlaylist = useCallback(
  //   (event) => {
  //     event.preventDefault();
  //     if (playlistName.title.trim().length === 0) {
  //       return null;
  //     }
  //     const id = generateUniqueId({
  //       length: 8,
  //       useLetters: true,
  //       useNumbers: true,
  //     });
  //     const strWithoutDiacritics = diacritics.remove(playlistName.title);
  //     const upperID = id.toUpperCase();
  //     const link = `/playlist/${strWithoutDiacritics.replaceAll(
  //       " ",
  //       "-"
  //     )}/${upperID}`;
  //     mutation.mutate({
  //       ...playlistName,
  //       encodeId: upperID,
  //       link,
  //       thumbnailM: "https://photo-zmp3.zmdcdn.me/album_default.png",
  //     });
  //     setIsModalOpen(false);
  //   },
  //   [playlistName]
  // );
  if (isPending) {
    return <Loading />;
  }
  if (isError) {
    toast(error.message);
    console.log(error.message);
  }

  return (
    <div className=" mt-12 w-full flex-auto">
      <div className="w-full">
        <div
          className={` flex flex-wrap ml-[-28px] overflow-hidden gap-y-[28px]`}
        >
          <div
            className={` ml-[28px]  min-1130:w-[calc((100%/5)-28px)]  w-[calc((100%/4)-28px)] flex-shrink-0`}
          >
            <div className="w-full">
              <div
                className=" pt-[calc(100%+45px)]  relative  group  border border-solid border-[--border-primary] rounded-md cursor-pointer"
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                <div className=" flex flex-col items-center justify-center absolute inset-0   text-[15px]">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center border-solid border-[2px] border-[--primary-color] group-hover:border-[--link-text-hover]">
                    <icons.plus className="text-[20px] text-[--text-primary] group-hover:text-[--link-text-hover]"></icons.plus>
                  </div>
                  <div className="text-[14px] font-bold text-[--text-primary] group-hover:text-[--link-text-hover]">
                    Thêm playlist mới
                  </div>
                </div>
              </div>
              <ModalCreateNewPlaylist
                setIsModalOpen={setIsModalOpen}
                isModalOpen={isModalOpen}
              ></ModalCreateNewPlaylist>
            </div>
          </div>
          {data.data.data.map((e) => (
            <div
              className={` ml-[28px]  min-1130:w-[calc((100%/5)-28px)]  w-[calc((100%/4)-28px)] flex-shrink-0`}
              key={e?.encodeId}
            >
              <PlaylistPrivateItem data={e}></PlaylistPrivateItem>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaylistOwner;
