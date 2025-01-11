import React from "react";
import { getHub } from "../apis/zing-api/home.api";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { HubList, HubList2, Playlist } from "../components";
import { Loading } from "../components";

const Hub = () => {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["hub"],
    queryFn: getHub,
  });
  if (isPending) {
    return <Loading />;
  }
  if (isError) {
    return <span>Error: {error.message}</span>;
  }
  return (
    <div className="">
      <div className="">
        <Link
          className="inline-block w-full"
          to={data.data.data.banners[0].link}
        >
          <div className="w-full  rounded-[4px] overflow-hidden ">
            <img
              className="w-full h-full object-cover "
              src={data.data.data.banners[0].cover}
            ></img>
          </div>
        </Link>
      </div>
      <HubList hubData={data.data.data.featured}></HubList>
      <HubList
        hubData={{ title: "Quốc gia", items: data.data.data.nations }}
      ></HubList>
      <HubList2
        hubData={{
          title: "Tâm Trạng Và Hoạt Động",
          items: data.data.data.topic,
        }}
      ></HubList2>
      {data.data.data.genre.map((playlist) => (
        <Playlist
          data={playlist.playlists}
          key={playlist.encodeId}
          hasArtist={true}
          url={playlist.link.split(".")[0]}
          title={playlist.title}
        ></Playlist>
      ))}
    </div>
  );
};

export default Hub;
