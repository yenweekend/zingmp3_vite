import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
const HubList = ({ hubData }) => {
  return (
    <HubListStyled className="mt-12">
      <h3 className="mb-5  text-[20px] font-bold text capitalize title">
        {hubData?.title}
      </h3>
      <div className="w-full">
        <div className=" flex items-center flex-nowrap ml-[-28px] overflow-hidden">
          {hubData?.items?.map((e) => (
            <div
              className={`item mb-[30px] max-1020:w-[calc((100%/2)-28px)]
                 max-1350:w-[calc((100%/3)-28px)]
                  w-[calc((100%/4)-28px)]
               ml-[28px] relative rounded-[4px] overflow-hidden group flex-shrink-0 `}
              key={e.encodeId}
            >
              <Link className="w-full" to={e?.link.split(".")[0]}>
                <div className="relative pb-[56.25%] overflow-hidden">
                  <LazyLoadImage
                    alt=""
                    className="w-full h-full object-cover absolute group-hover:scale-110 transition-all duration-500 "
                    src={e.thumbnail}
                    effect="blur"
                  />
          
                </div>
                <div className="absolute inset-0 mb-[10px] flex items-center justify-center">
                  <h3 className="text-[26px] font-bold content capitalize ">
                    {e.title}
                  </h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </HubListStyled>
  );
};
const HubListStyled = styled.div`
  .title {
    color: var(--text-primary);
  }
  .content {
    color: var(--white);
  }
`;
export default HubList;
