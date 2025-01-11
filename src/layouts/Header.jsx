import React, { useCallback, useEffect, useRef, useState } from "react";
import useClickAway from "../hooks/useClickAway";
import styled from "styled-components";
import icons from "../utils/icons";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UITheme, ArtistItem, Song } from "../components";
import { Modal } from "antd";
import { getSearch, getSuggest } from "../apis/zing-api/home.api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import paths from "../utils/paths";
import { createSearchParams } from "react-router-dom";
import { getFirstAndLastInitials } from "../helpers/generateImageText";
import { useDispatch, useSelector } from "react-redux";
import { accountSelector } from "../redux/auth/selector";
import { setAccount } from "../redux/auth/slice";
let timeout;
const Header = () => {
  const dispatch = useDispatch();
  const account = useSelector(accountSelector);
  const navigate = useNavigate();
  const location = useLocation();
  const [result, setResult] = useState(null);
  const [keyword, setKeyword] = useState(null);
  const settingRef = useRef();
  const avatarRef = useRef();
  const [focus, setFocus] = useState(false);
  const [isModalOpen, setIsOpenModal] = useState(false);
  const [isDropdown, setIsDropdown] = useState(false);
  const [isThemeModalOpen, setThemeModalOpen] = useState(false);
  const showModal = () => {
    setThemeModalOpen(true);
  };
  const handleOk = () => {
    setThemeModalOpen(false);
  };
  const handleCancel = () => {
    const themeUI = JSON.parse(localStorage.getItem("theme")).theme;
    if (
      !themeUI ||
      themeUI.trim().length === 0
      // !themes.some((theme) => theme === themeUI)
    ) {
      document.documentElement.className = "";
    } else {
      document.documentElement.className = themeUI;
    }
    setThemeModalOpen(false);
  };
  const handleInput = useCallback((e) => {
    setKeyword(e.target.value);
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (e.target.value.trim().length > 0) {
        mutation.mutate(e.target.value);
      }
    }, 1000);
  }, []);
  const handleEnter = useCallback(
    (e) => {
      if (e.keyCode === 13 && keyword.trim().length > 0) {
        navigate({
          pathname: `${paths.AllRESULT}`,
          search: createSearchParams({
            p: keyword,
          }).toString(),
        });
      }
    },
    [keyword]
  );
  const handleSearch = useCallback((keyword) => {
    navigate({
      pathname: `${paths.AllRESULT}`,
      search: createSearchParams({
        p: keyword,
      }).toString(),
    });
  }, []);

  const formRef = useRef();
  const ref = useRef();
  const currentRef = useRef();
  useEffect(() => {
    return () => {
      setFocus(false);
    };
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (document.querySelector(".modal-custom")?.contains(event.target)) {
        return;
      }
      if (formRef.current && !formRef.current.contains(event.target)) {
        setFocus(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useClickAway(ref, settingRef, () => {
    setIsOpenModal(false);
  });
  useClickAway(currentRef, avatarRef, () => {
    setIsDropdown(false);
  });

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["suggest"],
    queryFn: getSuggest,
  });
  const mutation = useMutation({
    mutationFn: getSearch,
    onSuccess: (data) => {
      setResult(data.data.data.items);
    },
  });

  if (isError) {
    return <span>Error: {error.message}</span>;
  }
  return (
    <HeaderStyled className="flex items-center justify-between h-full">
      <div
        className={` absolute h-full  left-0 right-0   w-[calc(100%+2px)] header_blur
      `}
      ></div>
      <div className=" flex justify-start items-center h-[40px]  relative  flex-grow flex-shrink-0">
        <div className=" h-6 w-[44px] cursor-pointer  flex flex-col justify-center primary-text">
          <icons.arrowPrev
            className={`text-inherit text-[20px] opacity-[0.5]
            `}
          ></icons.arrowPrev>
        </div>
        <div className="  h-6 w-[44px] cursor-pointer   flex flex-col justify-center primary-text">
          <icons.arrownext
            className={`text-inherit text-[20px] opacity-[0.5]`}
          ></icons.arrownext>
        </div>
        <div
          ref={formRef}
          className={`form-div primary-bg flex justify-start  relative  h-full w-full max-w-[440px]   ${
            focus ? "rounded-t-[20px] primary-color" : "rounded-[20px] alpha-bg"
          } `}
        >
          <div
            className={`absolute  w-full h-full flex items-center  rounded-[20px]
       `}
          >
            <button
              className=" p-[10px] flex items-center justify-center  cursor-pointer primary-text"
              id="btn"
              title="Tìm kiếm"
              aria-label="aria name"
              type="button"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <icons.search className="text-inherit text-[20px]"></icons.search>
            </button>
            <div className=" outline-none w-full  relative  group">
              <input
                autoComplete="off"
                type="text"
                className={`outline-none  text-[--search-text] block w-full h-[40px] pl-[5px] py-[5px] text-[14px] leading-[40px] relative   bg-transparent `}
                placeholder="Tìm kiếm bài hát, nghệ sĩ, lời bài hát..."
                onInput={handleInput}
                onKeyUp={handleEnter}
                onFocus={() => {
                  setFocus(true);
                }}
              />
            </div>
          </div>
          <div
            className={` primary-bg absolute w-full h-auto min-h-0  top-[100%] px-[10px] py-[13px]    transition duration-200 ease-linear rounded-b-[20px]  ${
              focus ? "block" : "hidden"
            } `}
          >
            <div className=" max-h-[calc(100vh-180px)] overflow-y-auto  primary-text no-scrollbar">
              {keyword?.trim().length === 0 || keyword === null ? (
                <>
                  <div className=" text-[14px] font-bold px-[10px] pb-2 primary-text">
                    Đề xuất cho bạn
                  </div>
                  <ul>
                    {data?.data?.data.map((e) =>
                      e?.link.length > 1 ? (
                        <li
                          className="flex items-center px-[10px] py-2  cursor-pointer rounded-[6px] search-item"
                          key={e.keyword}
                          onClick={() => {
                            let index = e?.link?.indexOf(".vn");
                            let link = e?.link.slice(index + 3).split(".")[0];

                            navigate(link);
                          }}
                        >
                          <div className="mr-[10px] icon_trend text-[16px]">
                            <icons.trend className="text-inherit"></icons.trend>
                          </div>
                          <div className="keyword text-[14px] ">
                            {e.keyword}
                          </div>
                        </li>
                      ) : (
                        <li
                          className="flex items-center px-[10px] py-2  cursor-pointer rounded-[6px] search-item"
                          key={e.keyword}
                          onClick={() => handleSearch(e.keyword)}
                        >
                          <div className="mr-[10px] icon_trend text-[16px]">
                            <icons.trend className="text-inherit"></icons.trend>
                          </div>
                          <div className="keyword text-[14px] ">
                            {e.keyword}
                          </div>
                        </li>
                      )
                    )}
                  </ul>
                </>
              ) : result !== null ? (
                <>
                  <div className=" text-[14px] font-bold px-[10px] pb-2 primary-text">
                    Tìm kiếm
                  </div>
                  <ul>
                    {result[0].keywords.map((e) => (
                      <li
                        className="flex items-center px-[10px] py-2 hover:bg-opas cursor-pointer rounded-[6px] search-item"
                        key={e.keyword}
                        onClick={() => handleSearch(e.keyword)}
                      >
                        <div className="mr-[10px] icon_trend text-[16px]">
                          <icons.search className="text-inherit"></icons.search>
                        </div>
                        <div className="keyword text-[14px]">
                          <span className="text-[14px] font-bold match-word ">
                            {e.keyword.slice(0, keyword?.length)}
                          </span>
                          <span className="text-[14px] ">
                            {e.keyword.slice(keyword?.length)}
                          </span>
                        </div>
                      </li>
                    ))}
                    <li className="flex items-center px-[10px] py-2 hover:bg-opas cursor-pointer rounded-[6px] search-item">
                      <div className="mr-[10px] icon_trend text-[16px]">
                        <icons.search className="text-inherit"></icons.search>
                      </div>
                      <div className="keyword text-[14px]">
                        <span className="text-[14px] ">Tìm kiếm</span>
                        <span className="text-[14px] font-bold match-word ">
                          {`" ${keyword} "`}
                        </span>
                      </div>
                    </li>
                  </ul>
                  <div className=" text-[14px] font-bold px-[10px] pb-2 mt-[10px] text-inherit ">
                    Gợi ý kết quả
                  </div>
                  {result[1].suggestions.map((item) =>
                    item.type === 1 ? (
                      <Song
                        duration={false}
                        dimension={52}
                        data={{ ...item, thumbnailM: item.thumb }}
                      ></Song>
                    ) : (
                      <ArtistItem
                        data={item}
                        key={item.playlistId}
                      ></ArtistItem>
                    )
                  )}
                </>
              ) : (
                <>
                  <div className=" text-[14px] font-bold px-[10px] pb-2 primary-text">
                    Tìm kiếm
                  </div>
                  <ul>
                    <li className="flex items-center px-[10px] py-2 hover:bg-opas cursor-pointer rounded-[6px] search-item">
                      <div className="mr-[10px] icon_trend text-[16px]">
                        <icons.search className="text-inherit"></icons.search>
                      </div>
                      <div className="keyword text-[14px]">
                        <span className="text-[14px] ">Tìm kiếm</span>
                        <span className="text-[14px] font-bold match-word ">
                          {`" ${keyword} "`}
                        </span>
                      </div>
                    </li>
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="header_left flex items-center gap-3 relative ">
        <div className="h-10 rounded-[28px] flex-1 px-5 flex items-center gap-1   cursor-pointer alpha-bg text-[--link-text-hover]">
          <div className=" text-inherit">
            <icons.download className="text-inherit"></icons.download>
          </div>
          <p className="text-[14px] font-semibold  text-inherit">
            Tải bản Windows
          </p>
        </div>
        <div className="relative">
          <div
            className="h-10 w-10 rounded-[50%]  flex items-center justify-center  cursor-pointer  alpha-bg primary-text "
            ref={settingRef}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpenModal((state) => !state);
            }}
          >
            <icons.setting className="text-[24px] text-inherit "></icons.setting>
          </div>
          {isModalOpen && (
            <div
              ref={ref}
              className="w-[300px] p-[6px] primary-bg rounded-[8px] menu-setting absolute top-[120%] right-0 z-[50]"
            >
              <ul id="setting">
                <li className=" rounded-[4px] text-[14px] cursor-pointer nav-text ">
                  <div className="h-11 py-[12px] px-[10px] flex items-center rounded-[4px] zm_button justify-between text-inherit">
                    <div className="flex items-center text-inherit">
                      <div className="mr-3 text-inherit">
                        <icons.block className="text-[20px]  icons text-inherit"></icons.block>
                      </div>
                      <span className="whitespace-nowrap  text-[14px] font-normal cursor-pointer text-inherit">
                        Chặn
                      </span>
                    </div>
                    <div>
                      <icons.arrowRight className="text-[18px] text-inherit primary-text"></icons.arrowRight>
                    </div>
                  </div>
                </li>
                <li className=" rounded-[4px] text-[14px] relative cursor-pointer nav-text group primary-text">
                  <div className="h-11 py-[12px] px-[10px] flex items-center rounded-[4px] zm_button justify-between text-inherit">
                    <div className="flex items-center text-inherit">
                      <div className="mr-3 text-inherit">
                        <icons.paint className="text-[20px]  icons text-inherit"></icons.paint>
                      </div>
                      <span className="whitespace-nowrap  text-[14px] font-normal cursor-pointer text-inherit">
                        Giao diện
                      </span>
                    </div>
                    <div>
                      <icons.arrowRight className="text-[18px] text-inherit primary-text"></icons.arrowRight>
                    </div>
                  </div>
                  <div className="absolute p-[6px]  w-[320px] left-[-316px] top-[8px] rounded-[8px]  primary-bg menu-setting group-hover:block hidden">
                    <div className="px-[10px] mb-3 " onClick={showModal}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[14px] font-normal ">Chủ đề</span>
                        <icons.arrowRight className="text-[16px]  icons"></icons.arrowRight>
                      </div>
                      <div className="flex items-center justify-start">
                        <div className="w-[86px] h-[56px] rounded-[4px] mr-3 relative ">
                          <LazyLoadImage
                            src={
                              JSON.parse(localStorage.getItem("theme")).bg_theme
                            }
                            effect="opacity"
                            alt="bg-theme"
                            className="w-full h-full object-cover"
                          ></LazyLoadImage>
                        </div>
                        <span className="text-[15px] font-semibold caption-top mb-[10px]">
                          {JSON.parse(localStorage.getItem("theme")).theme ||
                            "Sáng"}
                        </span>
                      </div>
                    </div>
                    <Modal
                      title="Giao diện"
                      open={isThemeModalOpen}
                      onOk={handleOk}
                      onCancel={handleCancel}
                      className="theme-ui"
                    >
                      <div className="container px-[30px] overflow-y-scroll max-h-[50vh] min-h-[500px] scroll_theme ">
                        <div className=" max-h-[50vh]  min-h-[500px">
                          <h3 className="title text-[18px] font-bold mb-[10px] capitalize primary-text">
                            Dynamic
                          </h3>
                          <div className="">
                            <div className="ml-[-14px] flex flex-wrap w-full">
                              <UITheme
                                url={
                                  "https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/London-thumb.png"
                                }
                                title={"London"}
                                theme={"london"}
                              ></UITheme>
                              <UITheme
                                url={
                                  "https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/dynamic-light-dark-1.jpg"
                                }
                                title={"Sáng tối"}
                                theme={"dark"}
                              ></UITheme>
                              <UITheme
                                url={
                                  "https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/dynamic-blue.jpg"
                                }
                                title={"Xanh da trời"}
                                theme={"blue"}
                              ></UITheme>
                              <UITheme
                                url={
                                  "https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/dynamic-pink.jpg"
                                }
                                title={"Hồng"}
                                theme={"pink-light"}
                              ></UITheme>
                              <UITheme
                                url={
                                  "https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/dynamic-brown.jpg"
                                }
                                title={"Nâu"}
                                theme={"gray"}
                              ></UITheme>
                            </div>
                          </div>
                          <h3 className="title text-[18px] font-bold mb-[10px] capitalize primary-text">
                            Chủ đề
                          </h3>
                          <div className="">
                            <div className="ml-[-14px] flex flex-wrap w-full">
                              <UITheme
                                url={
                                  "https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/xone-thumbn.jpg"
                                }
                                title={"XONE"}
                                theme={"xone"}
                              ></UITheme>
                              <UITheme
                                url={
                                  "https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/zma.jpg"
                                }
                                title={"Zing Music Awards"}
                                theme={"zma"}
                              ></UITheme>
                              <UITheme
                                url={
                                  "https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/eiffel.jpg"
                                }
                                title={"Tháp Eiffel"}
                                theme={"eiffel "}
                              ></UITheme>
                            </div>
                          </div>
                          <h3 className="title text-[18px] font-bold mb-[10px] capitalize primary-text">
                            Nghệ sĩ
                          </h3>
                          <div className="">
                            <div className="ml-[-14px] flex flex-wrap w-full">
                              <UITheme
                                url={
                                  "https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/jack.jpg"
                                }
                                title={"Jack"}
                                theme={"jack"}
                              ></UITheme>
                              <UITheme
                                url={
                                  "https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/iu.jpg"
                                }
                                title={"IU"}
                                theme={"iu"}
                              ></UITheme>
                              <UITheme
                                url={
                                  "https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/ji-chang-wook.jpg"
                                }
                                title={"Ji Chang Wook"}
                                theme={"jichangwook"}
                              ></UITheme>
                              <UITheme
                                url={
                                  "https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/lisa.jpg"
                                }
                                title={"Lisa"}
                                theme={"lisa"}
                              ></UITheme>
                              <UITheme
                                url={
                                  "https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/jennie.jpg"
                                }
                                title={"Jennie Kim"}
                                theme={"jennie"}
                              ></UITheme>
                              <UITheme
                                url={
                                  "https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/jisoo.jpg"
                                }
                                title={"Jisoo"}
                                theme={"jisoo"}
                              ></UITheme>
                              <UITheme
                                url={
                                  "https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/rose.jpg"
                                }
                                title={"Rosé"}
                                theme={"rose"}
                              ></UITheme>
                            </div>
                          </div>
                          <h3 className="title text-[18px] font-bold mb-[10px] capitalize primary-text">
                            Màu sáng
                          </h3>
                          <div className="">
                            <div className="ml-[-14px] flex flex-wrap w-full">
                              <UITheme
                                url={
                                  "https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/light.jpg"
                                }
                                title={"Sáng"}
                                theme={"light"}
                              ></UITheme>
                              <UITheme
                                url={
                                  "https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/gray.jpg"
                                }
                                title={"Xám"}
                                theme={"gray"}
                              ></UITheme>
                              <UITheme
                                url={
                                  "https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/green-light.jpg"
                                }
                                title={"Xanh Nhạt"}
                                theme={"green-light"}
                              ></UITheme>
                              <UITheme
                                url={
                                  "https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/pink-light.jpg"
                                }
                                title={"Hồng Cánh Sen"}
                                theme={"pink-light"}
                              ></UITheme>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Modal>

                    <div className="line_section  h-[1px] mx-auto my-[10px] w-[calc(100%-20px)]"></div>
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>
        <div className="relative ">
          {account.isLogin ? (
            <>
              <div
                className="h-10 w-10 rounded-[50%]  flex items-center justify-center  cursor-pointer  alpha-bg primary-text "
                ref={avatarRef}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdown(true);
                }}
              >
                {getFirstAndLastInitials(account.username)}
              </div>
              {isDropdown && (
                <div
                  ref={currentRef}
                  className="w-[300px] p-[6px] primary-bg rounded-[8px] menu-setting absolute top-[120%] right-0 z-[50]"
                >
                  <div className="info flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-full primary-text purple-bg flex items-center justify-center">
                      {getFirstAndLastInitials(account.username)}
                    </div>
                    <div className="text-[16px] font-medium primary-text">
                      {account.username}
                    </div>
                  </div>
                  <ul id="setting">
                    <li className=" rounded-[4px] text-[14px] cursor-pointer nav-text ">
                      <div
                        className="h-11 py-[12px] px-[10px] flex items-center rounded-[4px] zm_button justify-between text-inherit"
                        onClick={() => {
                          localStorage.removeItem("auth-token");
                          localStorage.removeItem("auth");
                          dispatch(
                            setAccount({ isLogin: false, username: false })
                          );
                          navigate("/auth/login");
                        }}
                      >
                        <div className="flex items-center text-inherit">
                          <div className="mr-3 text-inherit">
                            <icons.logout className="text-[20px]  icons text-inherit"></icons.logout>
                          </div>
                          <span className="whitespace-nowrap  text-[14px] font-normal cursor-pointer text-inherit">
                            Đăng xuất
                          </span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              )}
            </>
          ) : (
            <>
              <div
                className="h-10 w-10 rounded-full overflow-hidden   flex items-center justify-center  cursor-pointer  alpha-bg primary-text "
                ref={avatarRef}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdown(true);
                }}
              >
                <img
                  src="https://zjs.zmdcdn.me/zmp3-desktop/releases/v1.11.15/static/media/user-default.3ff115bb.png"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              {isDropdown && (
                <div
                  ref={currentRef}
                  className="w-[300px] p-[6px] primary-bg rounded-[8px] menu-setting absolute top-[120%] right-0 z-[50]"
                >
                  <div className="info flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-full overflow-hidden primary-text purple-bg flex items-center justify-center">
                      <img
                        src="https://zjs.zmdcdn.me/zmp3-desktop/releases/v1.11.15/static/media/user-default.3ff115bb.png"
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-[14px] font-medium primary-text">
                      Chưa đăng nhập
                    </div>
                  </div>
                  <ul id="setting">
                    <li className=" rounded-[4px] text-[14px] cursor-pointer nav-text ">
                      <div className="h-11 py-[12px] px-[10px] flex items-center rounded-[4px] zm_button justify-between text-inherit">
                        <Link
                          className="flex items-center text-inherit"
                          to={"/auth/login"}
                        >
                          <span className="mr-3 text-inherit">
                            <icons.login className="text-[20px]  icons text-inherit"></icons.login>
                          </span>
                          <span className="whitespace-nowrap  text-[14px] font-normal cursor-pointer text-inherit">
                            Đăng nhập
                          </span>
                        </Link>
                      </div>
                    </li>
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </HeaderStyled>
  );
};
const HeaderStyled = styled.div`
  .header_blur {
    background: var(--layout-header-bg);
    -webkit-backdrop-filter: blur(50px);
    backdrop-filter: blur(50px);
    width: calc(100% + 2px);
    box-shadow: 0 3px 5px var(--sticky-header-box-shadow);
  }
`;
export default Header;
