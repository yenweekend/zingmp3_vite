import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import icons from "../../utils/icons";
import styled from "styled-components";
const Favorite = () => {
  return (
    <WrappedFavorite className="mt-[70px]">
      <div className="pt-[40px]">
        <div className="relative">
          <div className="header flex items-center">
            <div className="font-bold text-[40px] leading-[48px] title">
              Thư viện
            </div>
            <div className="w-9 h-9 rounded-[50%] bg-[#fff] flex items-center justify-center ml-3">
              <icons.playsharp className="text-[28px] text-black ml-[3px]"></icons.playsharp>
            </div>
          </div>
          <div className="mt-12">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center cursor-pointer">
                  <div className="title uppercase font-bold text-[20px] mr-1">
                    playlist
                  </div>
                  <div className="w-[26px] h-[26px] bg_alpha rounded-[50%] flex items-center justify-center">
                    <icons.plus className="text-[20px] text-[#fff] "></icons.plus>
                  </div>
                </div>
                <div className="uppercase text-[12px] font-medium section_discovery flex items-center cursor-pointer title">
                  Tất cả
                  <div>
                    <icons.arrowRight className=" text-[20px] ml-3 section_discovery_icon"></icons.arrowRight>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-20 mt-12">
              <div className="mb-7">
                <div className="flex items-center relative">
                  <div className="h-[1px] absolute bottom-0 right-0 left-0 bg-[--border-primary] "></div>
                  <div className="text-[14px] font-medium items-center flex">
                    <NavLink
                      to={"/mymusic/song"}
                      className={({ isActive }) => {
                        return (
                          " py-[15px] uppercase border-b-[2px] border-solid mr-10" +
                          (isActive
                            ? " border-[--purple-primary] primary-text "
                            : " border-transparent text-[--navigation-text] ")
                        );
                      }}
                    >
                      Bài hát
                    </NavLink>

                    <NavLink
                      to={"/mymusic/album"}
                      className={({ isActive }) => {
                        return (
                          " py-[15px] uppercase border-b-[2px] border-solid mr-10" +
                          (isActive
                            ? " border-[--purple-primary] primary-text "
                            : " border-transparent text-[--navigation-text] ")
                        );
                      }}
                    >
                      Album
                    </NavLink>

                    <NavLink
                      to={"/mymusic/mv"}
                      className={({ isActive }) => {
                        return (
                          " py-[15px] uppercase border-b-[2px] border-solid mr-10" +
                          (isActive
                            ? " border-[--purple-primary] primary-text "
                            : " border-transparent text-[--navigation-text] ")
                        );
                      }}
                    >
                      MV
                    </NavLink>
                  </div>
                </div>
              </div>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </WrappedFavorite>
  );
};

const WrappedFavorite = styled.div`
  .item {
    color: var(--white);
  }
  .active {
    border-color: var(--purple-primary);
    background-color: var(--purple-primary);
  }

  .title {
    color: var(--text-primary);
  }
  .bg_alpha {
    background-color: var(--alpha-bg);
  }
  .subtitle {
    color: var(--text-secondary);
  }
  .section_discovery:hover {
    color: var(--link-text-hover);
    .section_discovery_icon {
      color: var(--link-text-hover);
    }
  }
  .section_discovery_text,
  .section_discovery_icon {
    color: var(--text-secondary);
  }
`;
export default Favorite;
