import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
const HubList2 = ({ hubData }) => {
  const [seeMore, setSeeMore] = useState(false);
  const data = useMemo(() => {
    return seeMore ? hubData?.items : hubData?.items?.slice(0, 8);
  }, [seeMore, hubData]);
  return (
    <HubList2Styled className="mt-12">
      <h3 className="mb-5 title text-[20px] font-bold">{hubData?.title}</h3>
      <div className="w-full">
        <div className="w-full flex items-center flex-wrap ml-[-28px]">
          {data?.map((e) => (
            <div
              className="item mb-[30px] w-[calc(100%/4-28px)] ml-[28px]  rounded-[4px] overflow-hidden relative group"
              key={e.encodeId}
            >
              <Link className="w-full" to={e.link.split(".")[0]}>
                <div className="relative pb-[56.25%] group-hover:scale-110 transition-all duration-500 ">
                  <LazyLoadImage
                    alt=""
                    className="w-full h-full object-cover absolute"
                    src={e.thumbnail}
                  />
                </div>
                <div className="absolute inset-0 pl-[15px] pb-[15px] flex flex-col items-start justify-end ">
                  <h3 className=" content leading-[1.39] text-[18px] font-bold ">
                    {e.title}
                  </h3>
                  <div className="thumbs flex items-center justify-start gap-[3px]">
                    {e?.playlists?.map((e) => (
                      <div
                        className="h-[60px] w-[60px] overflow-hidden rounded-[4px] relative"
                        key={e.encodeId}
                      >
                        <LazyLoadImage
                          alt=""
                          className="w-full h-full object-cover"
                          src={e.thumbnail}
                          effect="blur"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center">
          <button
            className="font-medium text-[12px] uppercase px-6 py-[9px] border border-solid border-[hsla(0,0%,100%,0.1)] mt-[10px]  rounded-[99px] text-white"
            onClick={(e) => {
              setSeeMore((state => !state));
    
            }}
          >
            {seeMore ? "Ẩn bớt" : " Xem thêm" }
          </button>
        </div>
      </div>
    </HubList2Styled>
  );
};
const HubList2Styled = styled.div`
  .title {
    color: var(--text-primary);
  }
  .content {
    color: var(--white);
  }
`;
export default HubList2;
