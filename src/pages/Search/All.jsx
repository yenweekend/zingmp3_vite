import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllSearch } from "../../apis/zing-api/search";
import styled from "styled-components";
import { searchMenu } from "../../utils/url_leftbar";
import { NavLink, useLocation } from "react-router-dom";
import {
  Song,
  SingerList,
  VideoList,
  Playlist,
  TopItem,
  Loading,
} from "../../components";
const All = () => {
  const { search } = useLocation();
  const keyword = useMemo(() => {
    const encodedString = search?.slice(3);
    const decodedString = decodeURIComponent(encodedString);
    const normalizedString = decodedString
      .normalize("NFC")
      .replaceAll("+", " ");
    return normalizedString;
  }, [search]);
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["search-all", keyword],
    queryFn: () => getAllSearch(keyword),
    enabled: !!keyword,
  });

  if (isPending) {
    return <Loading />;
  }
  if (isError) {
    return <span>Error: {error.message}</span>;
  }
  return (
    <WrappedAll className="">
      <div className="flex items-center relative mb-7">
        <div
          className={`h-[1px] absolute bottom-0  underline_header max-1130:right-[-29px] max-1130:left-[-29px] right-[-60px] left-[-60px]
        }`}
        ></div>
        <h3 className="text-[24px] font-bold  leading-[1.2] pr-5  title head_title">
          Kết quả tìm kiếm
        </h3>
        {searchMenu?.map((e) => (
          <div className="cursor-pointer " key={e.path}>
            <NavLink
              to={`/tim-kiem/${e.path}?q=${keyword?.replace(" ", "+")}`}
              key={e.path}
              className={({ isActive }) => {
                return (
                  "text-[14px] link  uppercase mx-5 py-[15px] inline-block cursor-pointer  font-medium  border-b-[2px] " +
                  (isActive
                    ? " border-[--purple-primary] primary-text"
                    : "border-transparent text-[--navigation-text]")
                );
              }}
            >
              {e.text}
            </NavLink>
          </div>
        ))}
      </div>
      <div>
        {Object.keys(data.data.data).map((key) =>
          key === "artists" ? (
            <SingerList
              data={{ items: data.data.data[`${key}`], title: "Nghệ sĩ / OA" }}
            ></SingerList>
          ) : key === "songs" ? (
            <div className="grid-cols-2 song-item grid-rows-3 grid gap-x-[24px]">
              {data.data.data[`${key}`].slice(0, 6).map((song) => (
                <Song data={song} duration={true} dimension={40}></Song>
              ))}
            </div>
          ) : key === "playlists" ? (
            <Playlist
              data={data.data.data[`${key}`]}
              title={"Playlist/Album"}
              url={`/tim-kiem/playlist?q=${keyword?.replace(" ", "+")}`}
            ></Playlist>
          ) : key === "videos" ? (
            <VideoList data={data.data.data[`${key}`]} title={"MV"}></VideoList>
          ) : key === "top" &&
            data.data.data[`${key}`].objectType === "song" ? (
            <>
              <div className="grid grid-cols-3 gap-x-[24px]">
                <Song
                  data={data.data.data[`${key}`]}
                  title={true}
                  dimension={84}
                ></Song>
                <TopItem
                  data={data.data.data[`${key}`]["artists"][0]}
                  dimension={84}
                ></TopItem>
              </div>
            </>
          ) : key === "top" && data.data.data[`${key}`].objectType === "hub" ? (
            <>
              <div className="grid grid-cols-3 gap-x-[24px]">
                <TopItem
                  data={data.data.data[`${key}`]}
                  dimension={84}
                  objectType="hub"
                ></TopItem>
              </div>
            </>
          ) : key === "topSuggest" ? (
            <Playlist
              title={"Playlist nổi bật"}
              data={data.data.data[`${key}`]}
            ></Playlist>
          ) : (
            ""
          )
        )}
      </div>
    </WrappedAll>
  );
};
const WrappedAll = styled.div`
  .text {
    color: var(--text-primary);
  }
  .title {
    color: var(--text-primary);
  }
  .head_title {
    border-right: 1px solid var(--border-primary);
  }
  .underline_header {
    background-color: var(--border-primary);
  }

  .link:hover {
    color: var(--text-item-hover);
    border-bottom: 2px solid var(--text-item-hover);
  }
`;
export default All;
