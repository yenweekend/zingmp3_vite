import React, { useState, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSongCollection } from "../../apis/mongoose-api/song.api";
import { Loading, ModalAddSongToPlaylist } from "../../components";
import toast from "../../helpers/notification";
import { SongCollectionList, Empty } from "../../components";
import icons from "../../utils/icons";
import { putQueueSong } from "../../redux/queueSong/slice";
import { useDispatch } from "react-redux";
import ModalPlaylist from "../../components/Modals/ModalPlaylist";
import generateUniqueId from "generate-unique-id";
const FavoriteSong = () => {
  const viewRef = useRef();
  const dispatch = useDispatch();
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [songSelect, setSongSelect] = useState([]);
  const { isPending, isError, error, data } = useQuery({
    queryKey: ["songcollection"],
    queryFn: getSongCollection,
  });
  const handleSelectOne = useCallback((event, song) => {
    setSongSelect((state) => {
      if (event.target.checked) {
        // Add song to the selection
        return [...state, song];
      } else {
        // Remove song from the selection
        return state.filter((item) => item.encodeId !== song.encodeId);
      }
    });
  }, []);
  const handleSelectAll = useCallback(
    (event) => {
      if (data) {
        if (event.target.checked) {
          setSongSelect(data.data.data.song.items);
        } else {
          setSongSelect([]);
        }
      }
    },
    [data]
  );
  const handleAddMutipleSongToQueue = useCallback(() => {
    if (data) {
      const itemMap = songSelect.reduce((initital, result) => {
        const id = generateUniqueId({
          length: 8,
          useLetters: true,
          useNumbers: true,
        });
        initital[id] = {
          ...result,
        };
        return initital;
      }, {});
      dispatch(putQueueSong({ queue_song: itemMap }));
      toast(`Đã thêm các bài hát vào danh sách phát`);
    }
  }, [data, songSelect]);
  if (isPending) {
    return <Loading />;
  }
  if (error) {
    toast(error.message);
  }
  return data.data.data.length === 0 ? (
    <Empty
      noticeText={"Không có bài hát nào trong thư viện"}
      icon={
        <icons.notemusic className="secondary-text text-[30px]"></icons.notemusic>
      }
    ></Empty>
  ) : (
    <div className="list mb-[10px]">
      <div className="p-[10px] flex justify-between items-center song-list">
        <div className="flex items-center w-[50%]">
          {songSelect.length > 0 ? (
            <div className="flex items-center justify-center mr-[10px]">
              <label
                htmlFor="song"
                className="flex items-center justify-center checkbox relative cursor-pointer "
              >
                <input
                  type="checkbox"
                  name="song"
                  className="p-[6px] cursor-pointer relative"
                  onChange={handleSelectAll}
                />
              </label>
            </div>
          ) : (
            <div className="border border-gray-400 w-4 h-4 rounded-[4px] text-center flex items-center justify-center cursor-pointer mr-[10px]">
              <icons.sort className="leading-[66%] text-[16px] secondary-text"></icons.sort>
            </div>
          )}
          {songSelect.length > 0 ? (
            <div className="flex items-center gap-3">
              <div
                className="flex items-center gap-2 border-[--border-box] border-solid border rounded-full px-[10px] py-[2px] cursor-pointer"
                onClick={handleAddMutipleSongToQueue}
              >
                <icons.circlesolid className="text-[--text-secondary]"></icons.circlesolid>
                <span className="uppercase text-[10px] secondary-text">
                  Thêm vào danh sách phát
                </span>
              </div>
              <div
                className="h-[22px] w-[22px] rounded-full border-[--border-box] border-solid border flex items-center justify-center cursor-pointer relative"
                ref={viewRef}
                onClick={() => {
                  setIsOpenModal((state) => !state);
                }}
              >
                <icons.more className="text-[--text-secondary]"></icons.more>
              </div>
              <ModalPlaylist
                onClose={() => setIsOpenModal(false)}
                targetRef={viewRef}
                isOpen={isOpenModal}
              >
                <div className="w-[280px]">
                  <ModalAddSongToPlaylist
                    mutipleSong={songSelect}
                    onClose={() => setIsOpenModal(false)}
                  />
                </div>
              </ModalPlaylist>
            </div>
          ) : (
            <div className=" text-[12px]  font-medium secondary-text">
              BÀI HÁT
            </div>
          )}
        </div>
        <div className="w-0 flex-auto text-[12px] font-medium  secondary-text">
          ALBUM
        </div>
        <div className="text-[12px] font-medium  secondary-text">THỜI GIAN</div>
      </div>
      <div className="album">
        {data.data.data.map((song) => (
          <div
            className={` flex justify-between items-center h-[60px] group  relative cursor-pointer song-info  rounded p-[10px] song-list ${
              songSelect.some((item) => item.encodeId === song.encodeId)
                ? "bg-[--alpha-bg]"
                : ""
            }`}
            key={song.encodeId}
          >
            <div
              className={` absolute top-[50%] translate-y-[-50%] w-[34px] h-[34px] ${
                songSelect.some((item) => item.encodeId === song.encodeId) ||
                songSelect.length > 0
                  ? "block"
                  : "hidden group-hover:block"
              } left-0 `}
            >
              <div className="flex items-center justify-center w-full h-full">
                <label
                  htmlFor="song"
                  className="flex items-center justify-center checkbox relative cursor-pointer "
                >
                  <input
                    checked={songSelect.some(
                      (item) => item.encodeId === song.encodeId
                    )}
                    type="checkbox"
                    name="song"
                    className="p-[6px] cursor-pointer relative"
                    value={song.encodeId}
                    onChange={(event) => {
                      handleSelectOne(event, song);
                    }}
                  />
                </label>
              </div>
            </div>
            <SongCollectionList song={song}>
              <div
                className={`  w-4 h-4 rounded-[4px] text-center flex items-center justify-center cursor-pointer mr-[10px]  visible group-hover:invisible ${
                  songSelect.some((item) => item.encodeId === song.encodeId) ||
                  songSelect.length > 0
                    ? "invisible"
                    : ""
                }`}
              >
                <icons.notemusic className="leading-[66%] text-[16px] secondary-text"></icons.notemusic>
              </div>
            </SongCollectionList>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteSong;
