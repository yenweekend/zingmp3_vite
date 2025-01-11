import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMVCollection } from "../../apis/mongoose-api/mv.api";
import toast from "../../helpers/notification";
import { VideoList, Loading, Empty } from "../../components";
import icons from "../../utils/icons";
const FavoriteMV = () => {
  const { isPending, isError, error, data } = useQuery({
    queryKey: ["mvcollection"],
    queryFn: getMVCollection,
  });
  if (isPending) {
    return (
      <>
        <div className="w-screen h-screen bg-black">
          <Loading />
        </div>
      </>
    );
  }
  if (isError) {
    toast(error.message);
  }
  return data.data.favorite.length === 0 ? (
    <Empty
      noticeText={"Không có MV nào"}
      icon={
        <icons.notemusic className="secondary-text text-[30px]"></icons.notemusic>
      }
    ></Empty>
  ) : (
    <VideoList
      wrap={true}
      data={data.data.favorite}
      header={false}
      isDeleteFromCollection={true}
    ></VideoList>
  );
};

export default FavoriteMV;
