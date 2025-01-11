import React from "react";
import { getHubDetail } from "../apis/zing-api/home.api";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Playlist, Song, SingerList } from "../components";
import { Loading } from "../components";

const HubDetail = () => {
  const { id } = useParams();
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["hubdetail", id],
    queryFn: () => getHubDetail(id),
    enabled: !!id,
  });
  if (isPending) {
    return <Loading />;
  }
  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <div>
      <div className=" relative pb-[30%]">
        <div className="absolute w-full h-full">
          <div className="absolute top-0 bottom-0 left-[-60px] right-[-60px]">
            <LazyLoadImage
              alt=""
              src={data.data.data.cover}
              className="w-full h-full object-cover"
              effect="blur"
            />
          </div>
        </div>
      </div>
      {data.data.data.sections.map((item) =>
        item.sectionType === "playlist" ? (
          <Playlist
            data={item.items}
            title={item.title}
            hasArtist={true}
            key={item.title}
          ></Playlist>
        ) : item.sectionType === "song" ? (
          <>
            <h3 className="text-[20px] font-bold  primary-text mb-5 mt-[48px]">
              {item.title}
            </h3>
            <div
              className={
                "grid min-1220:grid-cols-3 grid-cols-2 gap-x-[14px] new-release-content transition-all ease-linear duration-150"
              }
              style={{
                gridTemplateRows: `repeat(5, minmax(0, 1fr))`,
              }}
            >
              {item.items.map((song) => (
                <Song
                  dimension={40}
                  key={song.encodeId}
                  data={song}
                  duration={true}
                ></Song>
              ))}
            </div>
          </>
        ) : item.sectionType === "artist" ? (
          <SingerList
            data={{ title: item.title, items: item.items.slice(0, 5) }}
          ></SingerList>
        ) : (
          ""
        )
      )}
    </div>
  );
};

export default HubDetail;
