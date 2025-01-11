import React, { useEffect } from "react";

import "react-lazy-load-image-component/src/effects/blur.css";

import ViewAllLink from "./ViewAllLink";
import PlaylistItem from "./PlaylistItem";
import PlaylistCollectionItem from "./PlaylistCollectionItem";
import { useQuery } from "@tanstack/react-query";
import { getPlaylistCollection } from "../apis/mongoose-api/playlist.api";
import toast from "../helpers/notification";
import Loading from "./Loading";
import { useDispatch, useSelector } from "react-redux";
import { setCollection } from "../redux/collection/slice";
import { isLoginSelector } from "../redux/auth/selector";
const Playlist = ({
  hasArtist = false,
  sortDesc = false,
  header = true,
  data,
  title,
  url = "/",
  wrap = false,
  viewAll = true,
  hasDeleteFromCollection = false,
  isHistory = false,
}) => {
  return (
    <div className=" mt-12 w-full flex-auto">
      {header && (
        <div className="section_header w-full flex justify-between mb-5">
          <h3 className="text-[20px] font-bold capitalize leading-[1.5] primary-text ">
            {title}
          </h3>
          {viewAll && <ViewAllLink url={url}></ViewAllLink>}
        </div>
      )}

      <div className="w-full">
        <div
          className={` flex ${
            wrap ? "flex-wrap" : "flex-nowrap"
          } ml-[-28px] overflow-hidden gap-y-[28px]`}
        >
          {data?.map((e) => (
            <div
              className={` ml-[28px]  min-1130:w-[calc((100%/5)-28px)]  w-[calc((100%/4)-28px)] flex-shrink-0`}
              key={e?.encodeId}
            >
              {hasDeleteFromCollection ? (
                <PlaylistCollectionItem
                  playlistData={e}
                ></PlaylistCollectionItem>
              ) : (
                <PlaylistItem playlistData={e}></PlaylistItem>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Playlist;
