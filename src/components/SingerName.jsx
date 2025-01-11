import React from "react";
import { Link } from "react-router-dom";
const SingerName = ({
  artists,
  fontSize = 12,
  clamp = 1,
  videopage = false,
  currentSong = false,
}) => {
  return (
    <h3
      className={`${
        videopage ? "text-[hsla(0,0%,100%,.5)]" : "secondary-text"
      } ${clamp === 1 ? "line-clamp-1" : "line-clamp-2"}`}
      style={{
        fontSize: `${fontSize}px`,
      }}
    >
      {artists?.map((artist, index) => (
        <>
          <Link
            to={`/nghe-si/${artist.alias}`}
            className={`${
              currentSong ? "text-[hsla(0,0%,100%,.6)]" : "text-inherit "
            } artist-links`}
            key={artist.id}
          >
            {artist.name}
          </Link>
          {index < artists.length - 1 && ", "}
        </>
      ))}
    </h3>
  );
};

export default SingerName;
