import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "../../components";
import icons from "../../utils/icons";
import { getPlaylistCollection } from "../../apis/mongoose-api/playlist.api";
import { Playlist } from "../../components";
import { Empty } from "../../components";
const PlaylistCollect = () => {
  const { isPending, isError, error, data } = useQuery({
    queryKey: ["playlistcollection"],
    queryFn: getPlaylistCollection,
  });
  if (isPending) {
    return <Loading />;
  }
  if (error) {
    toast(error.message);
  }
  return data.data.data.length === 0 ? (
    <Empty
      noticeText={"Không có playlist nào trong thư viện"}
      icon={
        <icons.notemusic className="secondary-text text-[30px]"></icons.notemusic>
      }
    ></Empty>
  ) : (
    <Playlist
      data={data.data.data}
      wrap={true}
      header={false}
      isDelete={true}
    ></Playlist>
  );
};

export default PlaylistCollect;
