import React, { useRef, useState, useEffect, useCallback } from "react";
import icons from "../utils/icons";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ModalPlaylist from "./Modals/ModalPlaylist";
import SingerName from "./SingerName";
import { Popover } from "antd";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAlbum } from "../apis/zing-api/album.api";
import toast from "../helpers/notification";
import generateUniqueId from "generate-unique-id";
import { putQueueSong } from "../redux/queueSong/slice";
import { useDispatch } from "react-redux";
import HISTORY_KEY, { deleteFromHistory } from "../helpers/history";
import { addPlaylistToCollection } from "../apis/mongoose-api/playlist.api";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
const PlaylistHistoryItem = ({ playlistData, setPlaylistData }) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const viewRef = useRef(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: getAlbum,
    onSuccess: (data) => {
      toast(`Đã thêm playlist ${playlistData.title} vào danh sách phát`);
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
      dispatch(putQueueSong({ queue_song: itemMap }));
    },
    onError: (error) => {
      toast("Thêm vào playlist không thành công !");
    },
  });
  const collectMutation = useMutation({
    mutationFn: addPlaylistToCollection,
    onSuccess: (data) => {
      toast(`Đã thêm ${playlistData.title} vào thư viện`);
      queryClient.invalidateQueries({ queryKey: ["playlistcollection"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const handleCollectPlaylist = useCallback(() => {
    const { title, artists, encodeId, thumbnailM, song, link } = playlistData;
    collectMutation.mutate({
      title,
      artists,
      encodeId,
      thumbnailM,
      song,
      link,
    });
  }, [playlistData]);
  const handleDeletePlaylistFromHistory = useCallback(
    (event) => {
      event.stopPropagation();
      const newState = deleteFromHistory(
        HISTORY_KEY.PLAYLIST,
        playlistData.encodeId
      );
      setPlaylistData(newState[HISTORY_KEY.PLAYLIST]);
    },
    [playlistData]
  );
  return (
    <div className="w-full">
      <div className=" pt-[100%]  relative rounded-xl group cursor-pointer  ">
        <div className="section_link inline-block absolute inset-0  ">
          <div className="img absolute inset-0 rounded  overflow-hidden">
            <LazyLoadImage
              alt=""
              effect="blur"
              src={playlistData.thumbnailM}
              className=" w-full h-full object-cover group-hover:scale-125  transitio-transform  ease-linear duration-700"
            />
          </div>
        </div>
        <div
          className={`options absolute inset-0 items-center justify-center flex 
                group-hover:visible invisible dark-alpha-50 rounded `}
          onClick={(event) => {
            event.stopPropagation();
            navigate(e?.link.split(".")[0]);
          }}
        >
          <Popover title="Thêm vào thư viện" trigger="hover" color="#363636">
            <div
              className={`heat  flex items-center justify-center w-8 h-8  cursor-pointer hover:bg-white hover:bg-opacity-25 rounded-[50%] mx-2 group/visible relative `}
              onClick={handleCollectPlaylist}
            >
              <icons.heart className="text-[16px] text-[--white]"></icons.heart>
            </div>
          </Popover>
          <div className=" text-white flex items-center justify-center w-10 h-10 border border-solid border-white rounded-[50%] cursor-pointer  ">
            <icons.playsharp className="text-[26px] text-[--white]"></icons.playsharp>
          </div>
          <Popover title="Xem thêm" trigger="hover" color="#363636">
            <div
              className="  flex items-center justify-center w-8 h-8  cursor-pointer hover:bg-white hover:bg-opacity-25 rounded-[50%] mx-2 group/visible relative "
              onClick={(event) => {
                event.stopPropagation();
                setIsOpenModal(true);
              }}
              ref={viewRef}
            >
              <icons.more className="text-[20px] text-[--white]"></icons.more>
            </div>
          </Popover>
          <ModalPlaylist
            onClose={() => setIsOpenModal(false)}
            targetRef={viewRef}
            isOpen={isOpenModal}
          >
            <div className="w-[280px] flex-shrink-0 py-[6px]">
              <div
                className=" py-[10px] options-btn flex items-center justify-start px-[15px] nav-text cursor-pointer"
                onClick={(event) => {
                  event.stopPropagation();
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
              <div
                className=" py-[10px] options-btn flex items-center justify-start px-[15px] nav-text cursor-pointer"
                onClick={handleDeletePlaylistFromHistory}
              >
                <div className="mr-[15px] flex items-center justify-center">
                  <icons.bin className=" "></icons.bin>
                </div>
                <span className="text-[14px]  font-normal">
                  Xóa khỏi lịch sử nghe
                </span>
              </div>
            </div>
          </ModalPlaylist>
        </div>
      </div>
      <div className="  font-bold text-[14px] mt-[12px] cursor-pointer secondary-text">
        <div className="flex items-center mb-[4px] ">
          <Link
            to={playlistData.link.split(".")[0]}
            className="w-0 flex-auto line-clamp-2 primary-text text-[14px] font-semibold title-link"
          >
            {playlistData.title}
          </Link>
        </div>
        <SingerName clamp={2} artists={playlistData.artists}></SingerName>
      </div>
    </div>
  );
};

export default PlaylistHistoryItem;
