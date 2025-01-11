import React, { useCallback, useEffect } from "react";
import icons from "../utils/icons";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import moment from "moment";
import SingerName from "./SingerName";
import { Link } from "react-router-dom";
import HISTORY_KEY, {
  addToHistory,
  deleteFromHistory,
} from "../helpers/history";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Popover } from "antd";
import { deleteMVFromCollection } from "../apis/mongoose-api/mv.api";
import toast from "../helpers/notification";
const VideoList = ({
  data,
  wrap = false,
  header = true,
  setData,
  title,
  isDeleteHistory = false,
  isDeleteFromCollection = false,
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteMVFromCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mvcollection"] });
      toast(`Đã xóa ${data} khỏi thư viện`);
    },
    onError: (error) => {
      toast(error.message);
    },
  });
  const handleDeleteMVFromCollection = useCallback(
    (encodeId) => {
      mutation.mutate(encodeId);
    },
    [data]
  );
  return (
    data && (
      <div>
        {header && (
          <h3 className="mb-5 text-[20px] font-bold title mt-[48px]">
            {title}
          </h3>
        )}

        <div
          className={`flex ${
            wrap ? "flex-wrap" : "flex-nowrap"
          } ml-[-28px] overflow-hidden`}
        >
          {data.map((e) => (
            <div
              className={`item ml-[28px] mb-[30px] flex-shrink-0 min-1130:w-[calc((100%/3)-28px)]  w-[calc((100%/2)-28px)] `}
              key={e.encodeId}
            >
              <div className="thumb relative pb-[56.25%] rounded overflow-hidden group cursor-pointer ">
                <LazyLoadImage
                  alt=""
                  className="absolute w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                  src={e.thumbnailM}
                  effect="blur"
                />
                <Link
                  to={e.link.split(".")[0]}
                  className=" absolute inset-0 dark-alpha-50  z-[1] hidden group-hover:block "
                  onClick={(event) => {
                    event.stopPropagation();
                    addToHistory(HISTORY_KEY.MV, e);
                    const prevOpenUrl = localStorage.getItem("prev_open_url");
                    if (!prevOpenUrl) {
                      localStorage.setItem(
                        "prev_open_url",
                        window.location.href
                      );
                    } else {
                      if (prevOpenUrl !== window.location.href) {
                        localStorage.setItem(
                          "prev_open_url",
                          window.location.href
                        );
                      }
                    }
                  }}
                >
                  <span className="absolute flex items-center justify-center w-10 h-10 border border-solid border-white top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-[50%] cursor-pointer">
                    <icons.play className="text-[16px] text-white"></icons.play>
                  </span>
                </Link>
                <div className="absolute  inline-block text-[12px] px-[5px] py-[3px] right-[5px] bottom-[5px] dark-alpha-50  primary-text rounded group-hover:z-10">
                  {moment.utc(e?.duration * 1000).format("mm:ss")}
                </div>
                {isDeleteHistory && (
                  <Popover title="Xóa" trigger="hover" color="#363636">
                    <div
                      className="absolute text-[12px] p-[10px] right-[5px] top-[5px] dark-alpha-50 rounded-full primary-text hidden group-hover:block group-hover:z-[20] group-hover:bg-[--alpha-bg] "
                      onClick={(event) => {
                        event.stopPropagation();
                        const history = deleteFromHistory(
                          HISTORY_KEY.MV,
                          e.encodeId
                        );
                        setData(history[HISTORY_KEY.MV]);
                      }}
                    >
                      <icons.close className="text-[#fff] text-[20px]"></icons.close>
                    </div>
                  </Popover>
                )}
                {isDeleteFromCollection && (
                  <Popover
                    title="Xóa khỏi yêu thích"
                    trigger="hover"
                    color="#363636"
                  >
                    <div
                      className="absolute text-[12px] p-[10px] right-[5px] top-[5px] dark-alpha-50 rounded-full primary-text hidden group-hover:block group-hover:z-[20] group-hover:bg-[--alpha-bg] "
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDeleteMVFromCollection(e.encodeId);
                      }}
                    >
                      <icons.close className="text-[#fff] text-[20px]"></icons.close>
                    </div>
                  </Popover>
                )}
              </div>
              <div className="py-[10px] flex items-center ">
                <Link
                  to={e.artist.link}
                  className="h-10 w-10 overflow-hidden rounded-[50%] mr-[10px] shrink-0"
                >
                  <LazyLoadImage
                    alt=""
                    className="object-cover w-full h-full"
                    src={e.artists[0].thumbnailM}
                  />
                </Link>
                <div className="flex-auto ">
                  <div className=" flex items-center  max-w-[100%]">
                    <span className=" text-[14px] capitalize w-0 flex-auto line-clamp-1 font-medium title ">
                      {e.title}
                    </span>
                  </div>
                  <SingerName artists={e.artists}> </SingerName>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default VideoList;
