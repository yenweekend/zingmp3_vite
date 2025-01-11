import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import PlayerBar from "./PlayerBar";
import Header from "./Header";
import icons from "../utils/icons";
import pathLeftSideBar, { pageMenu, privateMenu } from "../utils/url_leftbar";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { getSongCollection } from "../apis/mongoose-api/song.api";
import { getPlaylistCollection } from "../apis/mongoose-api/playlist.api";
import { PlaylistPrivateList, ModalCreateNewPlaylist } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { currentIdSelector } from "../redux/queueSong/selector";
import { isLoginSelector } from "../redux/auth/selector";
import toast from "../helpers/notification";
import { setCollection } from "../redux/collection/slice";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
const Master = () => {
  const isLogin = useSelector(isLoginSelector);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [show, setShow] = useState(false);
  const currentId = useSelector(currentIdSelector);
  const toggleSidebar = () => {
    setShow((prev) => !prev);
  };
  const hiddenShow = useCallback(() => {
    setShow(false);
  }, []);
  const { pathname } = useLocation();
  const contentRef = useRef(null);

  useEffect(() => {
    // Scroll nội dung trong Outlet lên đầu
    if (contentRef.current) {
      contentRef.current.scrollTo(0, 0);
    }
  }, [pathname]);
  useEffect(() => {
    window.addEventListener("resize", hiddenShow);

    return () => {
      window.removeEventListener("resize", hiddenShow);
    };
  }, []);

  const dispatch = useDispatch();
  const { isPending, isError, error, data } = useQuery({
    queryKey: ["playlistcollection"],
    queryFn: getPlaylistCollection,
    enabled: isLogin,
  });
  const {
    isPending: isPendingCollection,
    isError: isErrorCollection,
    error: errorCollection,
    data: dataCollection,
  } = useQuery({
    queryKey: ["songcollection"],
    queryFn: getSongCollection,
    enabled: isLogin,
  });
  useEffect(() => {
    if (dataCollection) {
      dispatch(
        setCollection({
          playlist: data.data.data,
        })
      );
    }
  }, [data]);

  useEffect(() => {
    if (dataCollection) {
      dispatch(
        setCollection({
          song: dataCollection.data.data,
        })
      );
    }
  }, [dataCollection]);

  if (isErrorCollection && isLogin && isError) {
    toast(errorCollection.message);
  }
  return (
    <div>
      <div className="flex w-screen h-screen screen-bg bg-no-repeat bg-[length:1920px_auto] bg-[--layout-bg]">
        <div
          className={` ${
            !show ? "min-1130:w-[240px] w-[70px]" : "w-[240px]"
          } shrink-0  h-[calc(100vh-90px)] overflow-hidden  pt-[70px] pb-[54px]   transition-all ease-linear duration-150 fixed top-0 left-0 bottom-0 bg-rightbar z-[999]`}
        >
          <div
            className={`${
              !show
                ? "min-1130:pr-[28px] min-1130:pl-[25px]  max-1130:w-[70px] "
                : "pr-[28px] pl-[25px]"
            }  flex items-center justify-center  h-[70px]  
            fixed  top-0 left-0 transition-all duration-100 ease-in`}
          >
            <Link
              to={"/"}
              className={`${
                !show //false
                  ? "min-1130:w-[120px] min-1130:h-[40px] bg-logo-mini w-[45px] h-[45px]  bg-logo  "
                  : "w-[120px] h-[40px] bg-logo-full " //true
              } shrink-0 bg-contain bg-no-repeat bg-center  cursor-pointer  `}
            ></Link>
          </div>
          <div className="flex flex-col h-full ">
            <div className="list_menu relative  mb-[15px]">
              <ul>
                {pathLeftSideBar.map((link) => (
                  <li
                    className="block h-[48px] cursor-pointer hover:bg-[--alpha-bg]"
                    key={link.path}
                  >
                    <NavLink
                      to={link.path}
                      end={link.end}
                      className={({ isActive }) => {
                        return (
                          "nav-text h-full  flex items-center gap-[20px]  py-[12px] px-[21px] border-l-[3px]  border-solid text-inherit " +
                          (isActive ? " nav-active" : " border-transparent")
                        );
                      }}
                    >
                      <div className=" w-6 h-6 text-inherit flex items-center justify-center ">
                        {link?.icons}
                      </div>

                      <div
                        className={`  ${
                          !show ? "min-1130:block hidden" : "block"
                        }  text-inherit text-[14px] font-medium`}
                      >
                        {link.text}
                      </div>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="sidebar-devider relative "></div>
            {/* list center */}
            <div className="mt-4 h-full grow-0  relative z-[2]">
              <div
                className=" mr-[-5px] overflow-y-auto scroll-bar-custom h-full absolute inset-0 z-[2]"
                onScroll={(e) => {
                  if (e.target.scrollTop != 0) {
                    e.target.classList.add("is_mark");
                  } else {
                    e.target.classList.remove("is_mark");
                  }
                }}
              >
                <div className="list_menu  mb-[15px] ">
                  <ul>
                    {pageMenu?.map((link) => (
                      <li
                        className="block h-[48px] hover:bg-[--alpha-bg]"
                        key={link.text}
                      >
                        <NavLink
                          to={link.path}
                          // className="  "
                          className={({ isActive }) => {
                            return (
                              "h-full  flex items-center gap-[20px]  py-[12px] px-[21px] border-l-[2px]  border-solid  nav-text " +
                              (isActive
                                ? "  nav-active"
                                : " border-transparent")
                            );
                          }}
                        >
                          <div className=" w-6 h-6  flex items-center justify-center text-inherit">
                            {link?.icons}
                          </div>

                          <div
                            className={`${
                              !show ? "min-1130:block hidden" : "block"
                            }   text-inherit text-[14px] font-medium `}
                          >
                            {link.text}
                          </div>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="max-1330:hidden flex items-center justify-center cursor-pointer">
                  <div className="thumb inline-block w-[200px] h-[125px] rounded-[8px] ">
                    <img
                      src="https://static-zmp3.zmdcdn.me/images/best-of-2023/promote.png"
                      className="w-full h-full object-cover"
                    ></img>
                  </div>
                </div>
                <div className="max-1330:hidden flex items-center justify-center cursor-pointer mt-4">
                  <div className=" w-[200px] h-[125px] rounded-[8px]  flex flex-col items-center justify-center py-[15px] px-2 vip-banner-sidebar">
                    <p className="text-center text-[12px]  mb-[10px] leading-[1.67]  font-semibold primary-text">
                      Nghe nhạc không quảng cáo cùng kho nhạc PRENIUM
                    </p>
                    <div className="inline-block uppercase rounded-[99px] bg-[#ffdb00] px-4 py-[6px] text-[12px] font-semibold">
                      Nâng cấp tài khoản
                    </div>
                  </div>
                </div>
                <div className="sidebar-devider relative "></div>
                {isLogin && (
                  <ul className=" mt-3  pb-4 relative">
                    {privateMenu?.map((e, index) => (
                      <li
                        key={e.path}
                        className=" group cursor-pointer  hover:bg-[--alpha-bg] "
                      >
                        <NavLink
                          className="flex items-center justify-between py-3 px-[21px]"
                          to={e.path}
                        >
                          <div className="flex items-start">
                            <div
                              className={`w-6 h-6 rounded-[10px] flex items-center justify-center nav-text mr-3
                                    ${
                                      index === 0
                                        ? "bg-[#891652]"
                                        : index === 1
                                        ? "bg-[#76ABAE]"
                                        : index === 2
                                        ? "bg-[#FF8E8F]"
                                        : index === 3
                                        ? "bg-[#124076]"
                                        : "bg-[#7469B6]"
                                    }`}
                            >
                              {e.icons}
                            </div>

                            <div
                              className={` ${
                                !show ? "min-1130:block hidden" : "block"
                              } text-inherit text-[14px] font-medium  nav-text`}
                            >
                              {e.text}
                            </div>
                          </div>
                          {e.path === "/mymusic/song/favorite" ? (
                            <div className="h-5 w-5 rounded-[50%] flex items-center justify-center border border-solid icon_play cursor-pointer invisible group-hover:visible nav-text">
                              <icons.playsharp className="text-[12px]  invisivle  text-inherit "></icons.playsharp>
                            </div>
                          ) : (
                            ""
                          )}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
                {!isLogin && (
                  <div className="max-1330:hidden  flex items-center justify-center cursor-pointer mt-4 ">
                    <div className=" w-[200px] h-[125px] rounded-[8px]  flex flex-col items-center justify-center py-[15px] px-2   purple-bg text_pm">
                      <p className="text-center text-[12px]  mb-[10px] leading-[1.67]  font-semibold text-inherit">
                        Đăng nhập để khám phá playlist dành riêng cho bạn
                      </p>
                      <Link
                        to={"/auth/login"}
                        className="inline-block uppercase rounded-[99px]  px-[35px] py-[6px] text-[12px] font-semibold login_btn text-inherit hover:opacity-80 alpha-bg border border-white "
                      >
                        Đăng nhập
                      </Link>
                    </div>
                  </div>
                )}
                <div className="sidebar-devider relative "></div>
                {isLogin && <PlaylistPrivateList />}
              </div>
            </div>
            {isLogin && (
              <div
                className={` fixed left-0  ${
                  !show ? "min-1130:w-[240px] w-[70px]" : "w-[240px]"
                } h-[54px]  cursor-pointer border-primary border-t flex items-center justify-center bottom-[90px]`}
              >
                <div
                  className={` w-full h-full nav-text px-6 ${
                    !show ? "min-1130:block hidden" : "block"
                  }`}
                >
                  <div
                    className="flex items-center w-full h-full"
                    onClick={() => {
                      setIsModalOpen(true);
                    }}
                  >
                    <div
                      className={`w-[24px] h-[24px] rounded-[10px]  relative mr-3  hover:bg-[rgba(20,20,20,0.4)] `}
                    >
                      <icons.plus className=" text-inherit center"></icons.plus>
                    </div>
                    <span className={` font-medium text-[14px] nav-text `}>
                      Tạo playlist mới
                    </span>
                    <button
                      className={`w-10 h-10 rounded-full alpha-bg shrink-0 nav-text relative ml-auto ${
                        show ? "max-1130:block hidden" : "hidden"
                      } `}
                      onClick={() => {
                        setShow(false);
                      }}
                    >
                      <icons.arrowLeft className="center text-inherit"></icons.arrowLeft>
                    </button>
                  </div>
                  <ModalCreateNewPlaylist
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                  ></ModalCreateNewPlaylist>
                </div>
                <div
                  className={`mx-auto  relative ${
                    !show ? "  min-1130:hidden block" : "hidden"
                  } w-10 h-10 rounded-full alpha-bg shrink-0 nav-text`}
                  onClick={toggleSidebar}
                >
                  {!show ? (
                    <icons.arrowRight className="center text-inherit"></icons.arrowRight>
                  ) : (
                    <icons.arrowLeft className="center text-inherit"></icons.arrowLeft>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div
          className={`flex-auto  overflow-y-auto no-scrollbar max-1130:ml-[70px] ml-[240px]`}
          ref={contentRef}
        >
          <div className="h-[70px]  fixed right-0 top-0 left-[70px] min-1130:left-[240px] px-[60px] z-[80] ">
            <Header />
          </div>
          <div className="mt-[70px] px-[59px] pb-[70px]">
            <Outlet />
          </div>
        </div>
      </div>
      {currentId !== null && <PlayerBar />}
      <WrappedToastify className="zm_notify_list"></WrappedToastify>
    </div>
  );
};
const WrappedToastify = styled.div`
  position: absolute;
  z-index: 9999;
  bottom: 90px;
  left: 0;
  width: 360px;
  transform: translateX(-100%);
  .close_toast {
    color: var(--text-primary);
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
  .toast_bg {
    width: 100%;
    padding: 10px 20px;
    border-radius: 4px;
    background-color: var(--primary-bg);
    box-shadow: 0 2px 5px var(--portal-menu-box-shadow);
  }
  li {
    width: 100%;
    padding: 10px 20px;
    border-radius: 4px;
    background-color: var(--primary-bg);
    box-shadow: 0 2px 5px var(--portal-menu-box-shadow);
    transform: translateX(100%);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  li span {
    color: var(--text-primary);
    line-height: 1.3;
    font-size: 14px;
  }
  .bold_text {
    font-weight: 500;
  }
  @keyframes fadeOut {
    to {
      opacity: 0;
    }
  }
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(0);
    }
    to {
      opacity: 1;
      transform: translateX(100%);
    }
  }
`;
export default Master;
