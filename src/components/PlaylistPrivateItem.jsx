import React, { useRef, useState, useEffect, useCallback } from "react";
import icons from "../utils/icons";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ModalPlaylist from "./Modals/ModalPlaylist";
import { Popover } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ModalDeletePlaylist, ModalUpdatePlaylist } from ".";
const PlaylistPrivateItem = ({ data }) => {
  const dispatch = useDispatch();
  const viewRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
  const [isOpenModalUpdate, setIsOpenModalUpdate] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <div className=" pt-[100%]  relative rounded-xl group cursor-pointer  ">
        <div className="section_link inline-block absolute inset-0  ">
          <div className="img absolute inset-0 rounded  overflow-hidden">
            <LazyLoadImage
              alt=""
              effect="blur"
              src={data?.thumbnailM}
              className=" w-full h-full object-cover group-hover:scale-125  transitio-transform  ease-linear duration-700"
            />
          </div>
        </div>
        <div
          className={`options absolute inset-0 items-center justify-center flex 
                group-hover:visible invisible dark-alpha-50 rounded `}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            navigate(data?.link.split(".")[0]);
          }}
        >
          <Popover title="Xóa" trigger="hover" color="#363636">
            <div
              className={`heat  flex items-center justify-center w-8 h-8  cursor-pointer hover:bg-white hover:bg-opacity-25 rounded-[50%] mx-2 group/visible relative `}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpenModalDelete(true);
              }}
            >
              <icons.close className="text-[20px] text-[#fff]"></icons.close>
            </div>
          </Popover>
          <div className=" text-white flex items-center justify-center w-10 h-10 border border-solid border-white rounded-[50%] cursor-pointer  ">
            <icons.playsharp className="text-[26px] text-[#fff]"></icons.playsharp>
          </div>
          <Popover title="Xem thêm" trigger="hover" color="#363636">
            <div
              className="  flex items-center justify-center w-8 h-8  cursor-pointer hover:bg-white hover:bg-opacity-25 rounded-[50%] mx-2 group/visible relative "
              onClick={(event) => {
                event.stopPropagation();
                setIsModalOpen(true);
              }}
              ref={viewRef}
            >
              <icons.more className="text-[20px] text-[#fff]"></icons.more>
            </div>
          </Popover>
        </div>
        <ModalPlaylist
          onClose={() => setIsModalOpen(false)}
          targetRef={viewRef}
          isOpen={isModalOpen}
        >
          <div className="w-[280px] flex-shrink-0 py-[6px]">
            <div className=" py-[10px] options-btn flex items-center justify-start px-[15px] nav-text cursor-pointer">
              <div className="mr-[15px] flex items-center justify-center">
                <icons.addplaynow className=" "></icons.addplaynow>
              </div>
              <span className="text-[14px]  font-normal">
                Thêm vào danh sách phát
              </span>
            </div>
            <div
              className=" py-[10px] options-btn flex items-center justify-start px-[15px] nav-text cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpenModalUpdate(true);
              }}
            >
              <div className="mr-[15px] flex items-center justify-center">
                <icons.pencil className=" "></icons.pencil>
              </div>
              <span className="text-[14px]  font-normal">
                Chỉnh sửa playlist
              </span>
            </div>
            <div
              className=" py-[10px] options-btn flex items-center justify-start px-[15px] nav-text cursor-pointer"
              onClick={(event) => {
                event.stopPropagation();
                setIsOpenModalDelete(true);
              }}
            >
              <div className="mr-[15px] flex items-center justify-center">
                <icons.bin className=" "></icons.bin>
              </div>
              <span className="text-[14px]  font-normal">Xóa playlist</span>
            </div>
          </div>
        </ModalPlaylist>
        <ModalDeletePlaylist
          isModalOpen={isOpenModalDelete}
          setIsModalOpen={setIsOpenModalDelete}
          playlistId={data._id}
        />
        <ModalUpdatePlaylist
          isModalOpen={isOpenModalUpdate}
          setIsModalOpen={setIsOpenModalUpdate}
          playlist={data}
        />
      </div>

      <div className="  font-bold text-[14px] mt-[12px] cursor-pointer secondary-text">
        <div className="flex items-center mb-[4px] ">
          <div className="w-0 flex-auto line-clamp-2 primary-text text-[14px] font-semibold title-link">
            {data.title}
          </div>
        </div>
        <h2>Nguyễn Văn Yên</h2>
      </div>
    </div>
  );
};

export default PlaylistPrivateItem;
