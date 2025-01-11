import React from "react";
import icons from "../utils/icons";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { convertNumber } from "../utils/constants";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Link } from "react-router-dom";
const SingerList = ({ data, wrap = false }) => {
  return (
    <SingerListStyled className="play_section mt-12 w-full flex-auto">
      <div
        className={`section_header w-full  
          }`}
      >
        <h3 className="text-[20px] font-bold  section_title mb-5">
          {data?.title}
        </h3>
      </div>

      <div className="w-full">
        <div
          className={` flex gap-y-[28px] ${
            wrap ? "flex-wrap" : "flex-nowrap"
          } ml-[-28px]  overflow-hidden`}
        >
          {data?.items?.map((e) => (
            <div
              className={`section_item ml-[28px] min-1350:w-[calc((100%/5)-28px)] w-[calc((100%/4)-28px)]
               flex-shrink-0`}
            >
              <div className="section_thumbnail pt-[100%]  relative  group cursor-pointer rounded-[50%] ">
                <div className="section_link inline-block absolute inset-0  ">
                  <div className="img absolute inset-0  rounded-[50%]  overflow-hidden ">
                    <LazyLoadImage
                      alt=""
                      src={e?.thumbnailM || e?.thumbnail}
                      className=" w-full h-full object-cover group-hover:scale-125 transition duration-700 ease-in-out"
                      effect="blur"
                    />
                  </div>
                </div>
                <div className="options absolute inset-0 items-center justify-center flex group-hover:visible invisible "></div>
              </div>
              <div className="mt-[15px] mb-[4px] text-center">
                <Link
                  className="primary-text text-center  text-[14px] mt-[12px] cursor-pointer text subtitle"
                  to={`/nghe-si/${e.alias}`}
                >
                  {e?.name}
                </Link>
              </div>
              <div className="secondary-text text-center text-[12px] leading-[1.33] whitespace-nowrap ">
                {convertNumber(e?.totalFollow)} quan tâm
              </div>
              <div className="py-[6px] px-[19px] flex items-center justify-center  gap-1 rounded-[16px] w-[70%] mx-auto mt-[15px] zm_btn cursor-pointer relative group overflow-hidden">
                <div className="absolute inset-0 invisible group-hover:visible group-hover:bg-[rgba(0,0,0,0.1)] "></div>
                <div>
                  <icons.add color="white"></icons.add>
                </div>
                <span className="uppercase text-[12px] font-normal text-white whitespace-nowrap">
                  quan tâm
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SingerListStyled>
  );
};
const SingerListStyled = styled.div`
  margin-bottom: 70px;
  .section_title {
    color: var(--text-primary);
  }
  .text {
    color: var(--text-primary);
  }

  .zm_btn {
    background-color: var(--purple-primary);
    color: var(--white);
  }
  .section_item_title:hover {
    text-decoration: underline;
    text-decoration-thickness: 0.3px;
    color: var(--link-text-hover);
  }
  .section_discovery:hover {
    .section_discovery_text,
    .section_discovery_icon {
      color: var(--link-text-hover);
    }
  }
  .section_discovery_text,
  .section_discovery_icon {
    color: var(--text-secondary);
  }
`;
export default SingerList;
