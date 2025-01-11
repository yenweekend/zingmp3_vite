import React, { useCallback, useEffect, useState } from "react";
import icons from "../utils/icons";
import moment from "moment";
import { useParams } from "react-router-dom";
import { Modal } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPlaylistDetail,
  updatePlaylistCreated,
} from "../apis/mongoose-api/playlist.api";
import { Loading, Empty, SongList } from "../components";
import toast from "../helpers/notification";
const Playlist = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState({ title: "" });
  const { id } = useParams();
  const mutation = useMutation({
    mutationFn: updatePlaylistCreated,
    onSuccess: (data) => {
      toast(`Cập nhật playlist thành công`);
      queryClient.invalidateQueries({ queryKey: ["playlistdetail"] });
      queryClient.invalidateQueries({ queryKey: ["playlistcreated"] });
    },
    onError: (error) => {
      toast(error.message);
    },
  });
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["playlistdetail", id],
    queryFn: () => getPlaylistDetail(id),
    enabled: !!id,
  });
  useEffect(() => {
    if (data) {
      setPlaylistName((state) => ({ ...state, title: data.data.data.title }));
    }
  }, [data]);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleChange = useCallback((e) => {
    setPlaylistName({ ...playlistName, [e.target.name]: e.target.value });
  }, []);
  const handleSave = useCallback(() => {
    if (playlistName.title.trim().length === 0) {
      toast("Nhập tên cho playlist");
      return null;
    }
    mutation.mutate({ id: data.data.data._id, formData: playlistName });
  }, [playlistName]);
  if (isPending) {
    return <Loading />;
  }
  if (isError) {
    return (
      <Empty
        noticeText={"Playlist không tồn tại"}
        icon={
          <icons.noteArt className="secondary-text text-[20px]"></icons.noteArt>
        }
      />
    );
  }
  return (
    <div className="pt-[40px]">
      <div className={`flex max-1200:flex-col `}>
        <div className={` pb-[30px] w-[300px] max-1200:w-full max-1200:flex  `}>
          <div
            className={` relative h-[300px] w-full "
               group overflow-hidden rounded-lg max-1200:w-[200px] max-1200:h-[200px]  max-1200:mr-[20px]`}
          >
            <img
              src={data.data.data.thumbnailM}
              className="w-full h-full object-cover group-hover:scale-125  transition-all duration-1000 flex-shrink-0  ease-linear "
            ></img>
            <div className="absolute inset-0  flex items-center justify-center invisible group-hover:visible group-hover:bg-[rgba(0,0,0,0.4)] duration-300 transition-all ease-linear">
              <div className="cursor-pointer  border-[2px] border-white rounded-[50%] ml-[3px] w-12 h-12 px-1 grid place-items-center ">
                <icons.playsharp className="text-[28px] text-white"></icons.playsharp>
              </div>
            </div>
          </div>
          <div
            className={`flex flex-col items-center max-1200:items-start
                    `}
          >
            <h3
              className={`primary-text text-[20px] font-bold text-center mt-3 max-1200:mt-0 flex items-center cursor-pointer gap-3`}
            >
              {data.data.data.title}
              <div
                className=""
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                <icons.pencil className="secodary-text text-[20px]"></icons.pencil>
              </div>
            </h3>
            <div className={`text-center `}>
              <span className="text-[12px] text-inherit capitalize secondary-text">
                cập nhật:
              </span>
              <span className="text-[12px] text-inherit leading-[1.75] secondary-text">
                {moment(data.data.data?.createdAt).format("DD/MM/YYYY")}
              </span>
            </div>
            <div className="max-1200:flex max-1200:items-center max-1200:gap-4 mt-[20px] max-1200:mt-[10px] ">
              <div className=" cursor-pointer purple-bg rounded-full text-[--white] flex items-center gap-3 py-[9px] px-[24px]">
                <icons.play></icons.play>
                <span className="text-inherit uppercase text-[16px]">
                  phát ngẫu nhiên
                </span>
              </div>
            </div>
          </div>
          <div className={``}></div>
        </div>
        {data.data.data.song.items.length === 0 ? (
          <div className="flex-1 ml-[30px] max-1200:ml-0">
            <Empty
              noticeText={"Không có bài hát nào"}
              icon={
                <icons.noteArt className="text-[20px] secondary-text"></icons.noteArt>
              }
            ></Empty>
          </div>
        ) : (
          <div className={` flex-1 ml-[30px] max-1200:ml-0`}>
            <div className="list mb-[10px]">
              <div className="p-[10px] flex justify-between items-center song-list">
                <div className="flex items-center w-[50%]">
                  <div className="border border-gray-400 w-4 h-4 rounded-[4px] text-center flex items-center justify-center cursor-pointer mr-[10px]">
                    <icons.sort className="leading-[66%] text-[16px] secondary-text"></icons.sort>
                  </div>
                  <div className=" text-[12px]  font-medium secondary-text">
                    BÀI HÁT
                  </div>
                </div>
                <div className="w-0 flex-auto text-[12px] font-medium  secondary-text">
                  ALBUM
                </div>
                <div className="text-[12px] font-medium  secondary-text">
                  THỜI GIAN
                </div>
              </div>
              <div className="album">
                {data.data.data?.song?.items.map((song) => (
                  <div
                    className=" flex justify-between items-center h-[60px] group  relative cursor-pointer song-info  rounded p-[10px] song-list "
                    key={song.encodeId}
                  >
                    <div className=" absolute top-[50%] translate-y-[-50%] w-[34px] h-[34px] hidden group-hover:block left-0 ">
                      <div className="flex items-center justify-center w-full h-full">
                        <label
                          htmlFor="song"
                          className="flex items-center justify-center checkbox relative cursor-pointer "
                        >
                          <input
                            type="checkbox"
                            name="song"
                            className="p-[6px] cursor-pointer relative"
                            value={song.encodeId}
                          />
                        </label>
                      </div>
                    </div>
                    <SongList
                      song={song}
                      deleteFromPlaylist={true}
                      playlistId={data.data.data._id}
                    >
                      <div className="  w-4 h-4 rounded-[4px] text-center flex items-center justify-center cursor-pointer mr-[10px]  visible group-hover:invisible">
                        <icons.notemusic className="leading-[66%] text-[16px] secondary-text"></icons.notemusic>
                      </div>
                    </SongList>
                  </div>
                ))}
              </div>
            </div>
            <div className="secondary-text">
              <div className="text-interhit ">
                <span className="text-inherit mr-2 text-[13px] font-medium ">
                  {data.data.data?.song.items.length} bài hát
                </span>
                <div className="inline-block w-[4px] h-[4px] rounded-[50%] secondary-bg top-[50%] translate-y-[-50%] left-0"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className="playlist-create"
      >
        <div className="form w-[330px] h-[300px]  relative p-5">
          <h3 className="text-[18px] mb-[10px] font-bold title text-center primary-text">
            Chỉnh sửa playlist
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
              onClick={handleSave}
            >
              Lưu
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Playlist;
