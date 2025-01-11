import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";
const History = () => {
  return (
    <WrappedHistory className="">
      <div className="flex items-center relative mb-7">
        <div className="h-[1px] absolute bottom-0 right-[-60px] left-[-60px] underline_header "></div>
        <h3 className="text-[24px] font-bold  leading-[1.2] pr-5  title head_title">
          Phát gần đây
        </h3>

        <div className="cursor-pointer ">
          <NavLink
            to={"/mymusic/history/song"}
            className={({ isActive }) => {
              return (
                "text-[14px] link  nav_text uppercase mx-5 py-[15px] inline-block cursor-pointer border-[2px] border-transparent font-medium " +
                (isActive ? " active_link" : " ")
              );
            }}
          >
            Bài hát
          </NavLink>
        </div>
        <div className="cursor-pointer ">
          <NavLink
            to={"/mymusic/history/playlist"}
            className={({ isActive }) => {
              return (
                "text-[14px] link  nav_text uppercase mx-5 py-[15px] inline-block cursor-pointer border-[2px] border-transparent font-medium " +
                (isActive ? " active_link" : " ")
              );
            }}
          >
            Playlist
          </NavLink>
        </div>
        <div className="cursor-pointer ">
          <NavLink
            to={"/mymusic/history/video"}
            className={({ isActive }) => {
              return (
                "text-[14px] link  nav_text uppercase mx-5 py-[15px] inline-block cursor-pointer border-[2px] border-transparent font-medium " +
                (isActive ? " active_link" : " ")
              );
            }}
          >
            MV
          </NavLink>
        </div>
      </div>
      <div>
        <Outlet />
      </div>
    </WrappedHistory>
  );
};
const WrappedHistory = styled.div`
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
    border-bottom: 2px solid var(--purple-primary);
  }
  .link:hover {
    color: var(--text-item-hover);
    border-bottom: 2px solid var(--purple-primary);
  }
  .nav_text {
    color: var(--navigation-text);
  }
`;
export default History;
