import React from "react";
import { SongList } from "../components";
import icons from "../utils/icons";
import { useQuery } from "@tanstack/react-query";
import { getSocialBoard } from "../apis/zing-api/home.api";
import styled from "styled-components";
import { Loading } from "../components";

const SocialBoard = () => {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["socialboard"],
    queryFn: getSocialBoard,
  });
  if (isPending) {
    return <Loading />;
  }
  if (isError) {
    return <span>Error: {error.message}</span>;
  }
  return (
    <WrappedSocialBoard>
      <div className="flex items-center">
        <h3 className="text-[40px] font-bold capitalize text leading-[1.5] primary-text">
          {data.data.data.title}
        </h3>
        <div className="h-10 w-10 rounded-[50%] flex items-center justify-center ml-3 cursor-pointer play_btn">
          <icons.playsharp className="text-[28px] "></icons.playsharp>
        </div>
      </div>
      {data.data.data.items.map((song, index) => (
        <div className="media  p-[10px] flex items-center group rounded-[4px] relative bor_b_1 ">
          <SongList song={song} key={song.encodeId}>
            <div className="song_prefix w-[83px] flex items-center mr-[15px]">
              <span
                className={` text-[32px] whitespace-nowrap font-black leading-[1] min-w-[43px] text-center w-[60px] mr-[5px] font-roboto ${
                  index == 0
                    ? "is_top_1"
                    : index == 1
                    ? "is_top_2"
                    : index == 2
                    ? "is_top_3"
                    : "stroke_primary"
                }`}
              >
                {index + 1}
              </span>
              {song.rakingStatus == 0 ? (
                <div className="primary-text flex flex-col items-center justify-center">
                  <icons.horizontal className="subtitle"></icons.horizontal>
                </div>
              ) : song.rakingStatus > 0 ? (
                <div className="primary-text flex flex-col items-center justify-center">
                  <icons.arrowupfill className="text-[16px] text-[#1dc186]"></icons.arrowupfill>
                  <span className=" text-[14p]">{song.rakingStatus}</span>
                </div>
              ) : (
                <div className="primary-text flex flex-col items-center justify-center">
                  <icons.arrowdownfill className="text-[20px] text-[#e35050]"></icons.arrowdownfill>
                  <span className=" text-[14p]">{song.rakingStatus * -1}</span>
                </div>
              )}
            </div>
          </SongList>
        </div>
      ))}
    </WrappedSocialBoard>
  );
};
const WrappedSocialBoard = styled.div`
  .play_btn {
    background-color: var(--white);
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  }
`;
export default SocialBoard;
