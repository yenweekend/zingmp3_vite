import React, {
  useRef,
  useEffect,
  useState,
  useLayoutEffect,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import icons from "../../utils/icons";
import { SingerName } from "../../components";
import {
  putQueueSong,
  setQueueSong,
  deleteSongFromQueue,
} from "../../redux/queueSong/slice";
import { useDispatch, useSelector } from "react-redux";
import generateUniqueId from "generate-unique-id";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPlaylistCreated } from "../../apis/mongoose-api/playlist.api";
import toast from "../../helpers/notification";
import {
  addSongToPlaylist,
  deleteSongFromPlaylist,
} from "../../apis/mongoose-api/song.api";
import { queueSongSelector } from "../../redux/queueSong/selector";
import { isLoginSelector } from "../../redux/auth/selector";
const Modal = ({
  targetRef,
  isOpen,
  onClose,
  data,
  children,
  isQueue = false,
  isdeleteSongFromPlaylist,
  playlistId = null,
}) => {
  const isLogin = useSelector(isLoginSelector);
  const queueSong = useSelector(queueSongSelector);
  const queryClient = useQueryClient();
  const {
    isPending,
    isError,
    error,
    data: playlistCreatedData,
  } = useQuery({
    queryKey: ["playlistcreated"],
    queryFn: getPlaylistCreated,
    enabled: isLogin,
  });
  const mutation = useMutation({
    mutationFn: addSongToPlaylist,
    onSuccess: (response) => {
      toast(response.data.message);
      onClose();
    },
    onError: (error) => {
      toast(error.message);
      onClose();
    },
  });
  const mutationDeleteSong = useMutation({
    mutationFn: deleteSongFromPlaylist,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["playlistdetail"] });
      toast(response.data.message);
      onClose();
    },
    onError: (error) => {
      toast(error.message);
      onClose();
    },
  });
  const dispatch = useDispatch();
  const popoverRef = useRef(null);
  const [tooltip, setTooltip] = useState({ tooltipX: null, tooltipY: null });
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        !targetRef.current.contains(event.target)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, targetRef, onClose]);
  useLayoutEffect(() => {
    if (isOpen && popoverRef.current) {
      const { height, width } = popoverRef.current.getBoundingClientRect();
      let tooltipX = 0;
      let tooltipY = 0;
      const targetRect = targetRef.current.getBoundingClientRect();
      tooltipX =
        targetRect.left - width > 0
          ? targetRect.left - width
          : targetRect.right;
      tooltipY =
        targetRect.top - height > 0
          ? targetRect.top - height
          : window.innerHeight - targetRect.bottom < height
          ? targetRect.bottom - 100
          : targetRect.bottom;
      setTooltip({ tooltipX: tooltipX, tooltipY: tooltipY });
    }
  }, [isOpen]);

  const handleDeleteSongFromQueue = useCallback(() => {
    dispatch(deleteSongFromQueue(data.songId));
    toast(`Đã xóa bài hát ${data.title} khỏi danh sách phát`);
  }, []);
  const handlePutQueueSong = useCallback(() => {
    const id = generateUniqueId({
      length: 8,
      useLetters: true,
      useNumbers: true,
    });
    const songItem = {
      [id]: data,
    };
    if (Object.keys(queueSong).length === 0) {
      dispatch(
        setQueueSong({
          queue_song: songItem,
          currentId: id,
          cursongEncodeId: data.encodeId,
        })
      );
    } else {
      dispatch(putQueueSong({ queue_song: songItem }));
    }
    toast(`Đã thêm bài hát ${data.title} vào danh sách phát`);
  }, [queueSong]);
  const handleAddSongInPlaylist = useCallback((id) => {
    const {
      title,
      artists,
      encodeId,
      duration,
      artistsNames,
      thumbnailM,
      album,
      setThumb,
      isWorldWide,
      distributor,
    } = data;
    const formData = {
      id: id,
      formData: {
        title,
        artists,
        encodeId,
        duration,
        artistsNames,
        thumbnailM,
        album,
        setThumb,
        isWorldWide,
        distributor,
      },
    };
    mutation.mutate(formData);
  }, []);
  const handleDeleteSongFromPlaylist = useCallback(() => {
    mutationDeleteSong.mutate({
      id: playlistId,
      formData: { encodeId: data.encodeId },
    });
  }, [playlistId, data]);
  if (!isOpen || !targetRef.current) return null;

  if (isError && isLogin) {
    toast(error.message);
  }
  return createPortal(
    <div
      ref={popoverRef}
      style={{
        position: "fixed",
        top: tooltip.tooltipY, // Below the target
        left: tooltip.tooltipX, // Aligned with target
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "4px",
        zIndex: 1000,
      }}
      className="primary-bg modal-custom"
    >
      <div className="w-[280px] flex-shrink-0 ">
        <div className="menu-header flex items-center mb-[15px] px-[15px] pt-[15px]">
          <div className="media_left w-10 h-10 overflow-hidden rounded-[6px] mr-[10px] flex-shrink-0 relative">
            <LazyLoadImage
              alt=""
              src={data.thumbnailM}
              className="w-full h-full object-cover shrink-0"
            />
          </div>
          <div className="media_right flex flex-col justify-start">
            <span className="text-[14px] font-medium whitespace-nowrap leading-[1.3] primary-text line-clamp-1 w-[200px]">
              {data.title}
            </span>
            <SingerName artists={data.artists}></SingerName>
          </div>
        </div>
        <div className="alpha-bg flex items-center rounded-lg overflow-hidden  justify-between mb-[10px] mx-[15px]">
          <div className="flex flex-col items-center w-[50%] py-2 rounded-[8px] primary-text gap-2">
            <div>
              <icons.downloadReal className="text-[16px] text-inherit"></icons.downloadReal>
            </div>
            <span className="text-[10px] font-normal leading-[14px] text-inherit">
              Tải xuống
            </span>
          </div>
          <div className="flex flex-col items-center w-[50%] py-2 rounded-[8px] primary-text gap-2">
            <div>
              <icons.forbid className="text-[16px] text-inherit"></icons.forbid>
            </div>
            <span className="text-[10px] font-normal leading-[14px] text-inherit">
              Chặn
            </span>
          </div>
        </div>
        {!isQueue && (
          <div
            className=" py-[10px] options-btn flex items-center justify-start px-[15px] nav-text cursor-pointer  "
            onClick={handlePutQueueSong}
          >
            <div className="mr-[15px] flex items-center justify-center">
              <icons.addplaynow className=" "></icons.addplaynow>
            </div>
            <span className="text-[14px]  font-normal ">
              Thêm vào danh sách phát
            </span>
          </div>
        )}

        <div className=" py-[10px] options-btn nav-text flex items-center justify-start px-[15px] isModalOpen cursor-pointer ">
          <div className="mr-[15px] flex items-center justify-center">
            <icons.playnext className=" "></icons.playnext>
          </div>
          <span className="text-[14px] font-normal  ">Phát tiếp theo</span>
        </div>
        <div className=" py-[10px] options-btn nav-text flex items-center justify-start px-[15px] isModalOpen cursor-pointer ">
          <div className="mr-[15px] flex items-center justify-center">
            <icons.radioC className=" "></icons.radioC>
          </div>
          <span className="text-[14px] font-normal  ">
            Phát nội dung tương tự
          </span>
        </div>
        <div className=" py-[10px] options-btn nav-text flex items-center justify-start px-[15px] isModalOpen cursor-pointer relative group ">
          <div className="mr-[15px] flex items-center justify-center">
            <icons.pluscircle className=" "></icons.pluscircle>
          </div>
          <div className="flex items-center justify-between grow ">
            <span className="text-[14px] font-normal  ">Thêm vào playlist</span>
            <icons.arrowRight className=""></icons.arrowRight>
            {isLogin && (
              <div className="absolute  right-[270px] top-[-155px] w-[230px] py-[15px] rounded-[8px] primary-bg shadow-[0_2px_5px_0px_rgba(0,0,0,0.2)] h-[295px] z-[9999] group-hover:block hidden ">
                <div className="px-[15px]">
                  <input
                    type="text"
                    name="playlist"
                    placeholder="Tìm kiếm playlist"
                    className="outline-none h-10 w-full rounded-[999px] text-[14px] bg-[--alpha-bg] px-[15px] leading-[1.5]  input placeholder-[--text-primary]"
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
                {isLogin &&
                  playlistCreatedData.data.data.map((playlist) => (
                    <div
                      className=" py-[10px] options-btn nav-text flex items-center justify-start px-[15px] hover:bg-[--alpha-bg] cursor-pointer "
                      key={playlist.encodeId}
                      onClick={() => {
                        handleAddSongInPlaylist(playlist._id);
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
            )}
          </div>
        </div>
        <div className=" py-[10px] options-btn flex items-center justify-start px-[15px] isModalOpen cursor-pointer nav-text">
          <div className="mr-[15px] flex items-center justify-center">
            <icons.link className=" "></icons.link>
          </div>
          <span className="text-[14px] font-normal  ">Sao chép link</span>
        </div>
        {isQueue && (
          <div
            className=" py-[10px] options-btn flex items-center justify-start px-[15px] isModalOpen cursor-pointer nav-text"
            onClick={handleDeleteSongFromQueue}
          >
            <div className="mr-[15px] flex items-center justify-center">
              <icons.bin className=" "></icons.bin>
            </div>
            <span className="text-[14px] font-normal  ">Xóa</span>
          </div>
        )}
        {isdeleteSongFromPlaylist && (
          <div
            className=" py-[10px] options-btn flex items-center justify-start px-[15px] isModalOpen cursor-pointer nav-text"
            onClick={handleDeleteSongFromPlaylist}
          >
            <div className="mr-[15px] flex items-center justify-center">
              <icons.bin className=" "></icons.bin>
            </div>
            <span className="text-[14px] font-normal  ">Xóa khỏi playlist</span>
          </div>
        )}

        <div className=" py-[10px] options-btn flex items-center justify-start px-[15px] relative group/share isModalOpen cursor-pointer">
          <div className="mr-[15px] flex items-center justify-center ">
            <icons.share className="nav-text "></icons.share>
          </div>
          <div className="flex items-center justify-between grow nav-text">
            <span className="text-[14px] font-normal  ">Chia sẻ</span>
            <icons.arrowRight className=""></icons.arrowRight>
          </div>
          <div className="absolute right-[97%] bottom-0 max-w-[270px] py-[15px] rounded-[8px] bg-bg-song shadow-[0_2px_5px_0px_rgba(0,0,0,0.2)] hidden group-hover/share:block zm_portal ">
            <div className=" py-[10px] flex items-center justify-start px-[15px] ">
              <div className="mr-[15px] flex items-center justify-center">
                <icons.face className=" "></icons.face>
              </div>
              <span className=" text-[14px] whitespace-nowrap font-normal  ">
                FaceBook
              </span>
            </div>
            <div className=" py-[10px] flex items-center justify-start px-[15px] ">
              <div className="mr-[15px] flex items-center justify-center">
                <icons.zalo className=" "></icons.zalo>
              </div>
              <span className=" text-[14px] whitespace-nowrap font-normal  ">
                Zalo
              </span>
            </div>
            <div className=" py-[10px] flex items-center justify-start px-[15px] ">
              <div className="mr-[15px] flex items-center justify-center">
                <icons.code className=" "></icons.code>
              </div>
              <span className=" text-[14px] whitespace-nowrap font-normal  ">
                Mã nhúng
              </span>
            </div>
          </div>
        </div>
        <div className="text-center  pt-[6px] pb-[12px] secondary-text ">
          <span className="font-semibold text-[13px] leading-[18px] text-inherit mb-[12px] whitespace-nowrap">
            Cung cấp bởi{" "}
          </span>
          <span className="font-semibold text-[13px] leading-[18px] text-inherit mb-[12px] whitespace-nowrap">
            {data.distributor}
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
