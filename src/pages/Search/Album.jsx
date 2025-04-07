import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllSearch } from "../../apis/zing-api/search";
import styled from "styled-components";
import { searchMenu } from "../../utils/url_leftbar";
import { NavLink, useLocation } from "react-router-dom";
import { Playlist, Loading } from "../../components";

const Album = () => {
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
    <WrappedAlbum className="">
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
                    ? " border-[--text-item-hover] primary-text"
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
        <h3 className="text-[16px] primary-text font-medium">Bài hát</h3>
        {
          <Playlist
            data={data.data.data[`playlists`]}
            title={"Playlist/Album"}
            wrap={true}
          ></Playlist>
        }
      </div>
    </WrappedAlbum>
  );
};
const WrappedAlbum = styled.div`
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
  .active_link {
    color: var(--text-item-hover);
    border-bottom: 2px solid var(--text-item-hover);
  }
  .link:hover {
    color: var(--text-item-hover);
    border-bottom: 2px solid var(--text-item-hover);
  }
`;
export default Album;
