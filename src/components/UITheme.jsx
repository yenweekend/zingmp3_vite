import React from "react";
import styled from "styled-components";
import icons from "../utils/icons";
import { LazyLoadImage } from "react-lazy-load-image-component";
const UITheme = ({ url, title, theme }) => {
  return (
    <WrappedUITheme className="w-[calc(100%/6-14px)] ml-[14px] mb-5 ">
      <div
        className={`zm_card_image border border-transparent border-solid theme_chosen
        rounded overflow-hidden `}
      >
        <div className="relative pb-[66.67%] w-full  group cursor-pointer  ">
          <div className="absolute w-full h-full group-hover:scale-110 transition-all duration-300 z-[10] overflow-hidden">
            <LazyLoadImage
              alt=""
              src={url}
              className="w-full h-full object-cover"
              effect="blur"
            />
          </div>

          <div
            className={`absolute w-5 h-5 rounded-[50%] is_check bottom-[8px] right-[8px] z-[20] flex items-center justify-center ${
              JSON.parse(localStorage.getItem("theme")).theme === theme
                ? "block"
                : "hidden"
            }`}
          >
            <icons.check className="icon_check"></icons.check>
          </div>

          <div className="absolute inset-0 bg-[rgba(0,0,0,0.3)] hidden  group-hover:block z-20">
            <div className="w-[100px] px-[10px] py-[5px] flex flex-col absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[30] ">
              <div
                className=" apply_btn  w-full uppercase font-semibold is_active text-[8px] py-[5px]  rounded-full  border border-solid mb-[10px] text-center hover:scale-95 transition-all duration-200 ease-linear"
                onClick={() => {
                  const value = {
                    theme: theme,
                    title: title,
                    bg_theme: url,
                  };
                  localStorage.setItem("theme", JSON.stringify(value));
                  document.documentElement.className = theme;
                }}
              >
                áp dụng
              </div>
              <div
                className=" apply_btn   uppercase w-full font-semibold  text-[8px] py-[5px]  rounded-full border border-solid text-center   hover:scale-95 transition-all duration-200 ease-linear"
                onClick={() => {
                  document.documentElement.className = theme;
                }}
              >
                xem trước
              </div>
            </div>
          </div>
        </div>
      </div>
      <h3 className="title leading-[1.36] font-medium text-[12px] py-[5px]">
        {title}
      </h3>
    </WrappedUITheme>
  );
};
const WrappedUITheme = styled.div`
  .icon_check {
    font-size: 18px;
    color: var(--white);
  }
  .is_check {
    background-color: var(--purple-primary);
  }
  .theme_chosen {
    border: 1px solid var(--purple-primary);
  }
  .zm_portal_modal {
    background-color: var(--primary-bg);
    border-radius: 8px;
    max-height: 100%;
  }
  .zm_btn {
    border-color: var(--white);
    color: var(--white);
  }
  .apply_btn {
    border-color: var(--white);
    color: white;
  }
  .apply_btn.is_active {
    border-color: var(--purple-primary) !important;
    background-color: var(--purple-primary);
  }
  .title {
    color: var(--text-primary);
  }
`;
export default UITheme;
