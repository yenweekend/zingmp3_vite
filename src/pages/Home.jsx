import React, { useEffect, useState } from "react";
import { LineChart, Playlist, SingerName, Song } from "../components";
import { Link } from "react-router-dom";
import { ViewAllLink, SlideShow, Header, Loading } from "../components";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Carousel } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getHome } from "../apis/zing-api/home.api";
import HISTORY_KEY from "../helpers/history";
import { getHistory } from "../helpers/history";
import DisabledButton from "../components/DisabledButton";
const Home = () => {
  const [countryPop, setCountryPop] = useState("all");
  const [historyPlaylist, setHistoryPlaylist] = useState(null);

  useEffect(() => {
    const history = getHistory();
    setHistoryPlaylist(history[HISTORY_KEY.PLAYLIST]);
  }, []);
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["home"],
    queryFn: getHome,
    refetchOnWindowFocus: false,
  });

  if (isPending) {
    return <Loading />;
  }
  if (isError) {
    toast(error.message);
  }

  return (
    <div className="">
      {data.data.data.items.map((item) =>
        item.sectionType === "playlist" ? (
          <Playlist data={item.items} title={item.title} />
        ) : item.sectionType === "banner" ? (
          <>
            <div className="carousel pt-[48px]">
              <Carousel autoplay autoplaySpeed={6000}>
                {item.items.map((slider) => (
                  <div
                    className="carousel-item  overflow-hidden cursor-pointer relative "
                    key={slider.encodeId}
                  >
                    <Link
                      to={
                        slider.link.includes("hub")
                          ? slider.link.split(".")[0]
                          : "/"
                      }
                      className="absolute inset-0 bg-transparent"
                    ></Link>
                    <LazyLoadImage
                      src={slider.banner}
                      alt="slider"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </Carousel>
            </div>
            <Playlist
              title={"Nghe gần đây"}
              data={historyPlaylist}
              url="/mymusic/history/playlist"
            ></Playlist>
          </>
        ) : item.sectionType === "new-release" ? (
          <div className="new-release">
            <h3 className="text-[20px] font-bold  primary-text mb-5 mt-[48px]">
              Mới phát hành
            </h3>
            <div className="flex justify-between items-center mb-4">
              <div className="button flex gap-[1rem]">
                <button
                  className={` text-[12px]  font-normal text-center cursor-pointer  uppercase  py-1 px-6 rounded-[16px] genres-btn primary-text ${
                    countryPop === "all" ? "genre-select" : ""
                  }`}
                  onClick={() => {
                    setCountryPop("all");
                  }}
                >
                  tất cả
                </button>
                <button
                  className={` text-[12px]  font-normal text-center cursor-pointer  uppercase  py-1 px-6 rounded-[16px] genres-btn primary-text ${
                    countryPop === "vPop" ? "genre-select" : ""
                  } `}
                  onClick={() => {
                    setCountryPop("vPop");
                  }}
                >
                  việt nam
                </button>
                <button
                  className={` text-[12px]  font-normal text-center cursor-pointer  uppercase  py-1 px-4 rounded-[16px] genres-btn primary-text ${
                    countryPop === "others" ? "genre-select" : ""
                  } `}
                  onClick={() => {
                    setCountryPop("others");
                  }}
                >
                  quốc tế
                </button>
              </div>
              <ViewAllLink url={"/"}></ViewAllLink>
            </div>
            <div
              className={
                "grid min-1220:grid-cols-3 grid-cols-2 gap-x-[14px] new-release-content transition-all ease-linear duration-150"
              }
              style={{
                gridTemplateRows: `repeat(4, minmax(0, 1fr))`,
              }}
            >
              {data.data.data.items
                .find((item) => item.sectionType === "new-release")
                .items[countryPop]?.slice(0, 12)
                .map((song) => (
                  <Song dimension={60} key={song.encodeId} data={song}></Song>
                ))}
            </div>
          </div>
        ) : item.sectionType === "weekchart" ? (
          <div className="">
            <div className="pt-10 mt-7 w-full flex-auto ">
              <div className="wrapper flex ml-[-28px] item-center flex-wrap">
                {item.items.map((e) => (
                  <div
                    className="item ml-7 w-[calc((100%/3)-28px)] h-auto opacity-75 cursor-pointer rounded-[8px] overflow-hidden group relative"
                    key={e.country}
                  >
                    <LazyLoadImage
                      alt=""
                      src={e.cover}
                      effect="blur"
                      className="w-full h-full object-cover group-hover:scale-125 transition duration-1000 ease-in-out"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : item.sectionType === "RTChart" ? (
          <LineChart data={item}></LineChart>
        ) : item.sectionType === "newReleaseChart" ? (
          <>
            <Header title={"BXH Nhạc mới"} url={"/"}></Header>
            <SlideShow
              data={
                data.data.data.items.find(
                  (item) => item.sectionId === "hNewrelease"
                ).items
              }
            />
          </>
        ) : (
          " "
        )
      )}
    </div>
  );
};

export default Home;
