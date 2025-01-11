import React, { useState, useMemo, useEffect } from "react";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { chartsGridClasses } from "@mui/x-charts/ChartsGrid";
import { chartsAxisHighlightClasses } from "@mui/x-charts";
import { LineChart } from "@mui/x-charts";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import icons from "../utils/icons";
import { Link } from "react-router-dom";
import styled from "styled-components";
const LineChartCp = ({
  data,
  rank = true,
  fontsize = 28,
  dimension = 24,
  playbtn = 16,
}) => {
  const [highlightedItem, setHighLightedItem] = useState({
    seriesId: Object.keys(data.chart.items)[0],
    dataIndex: 0,
  });
  const [highlighted, setHighlighted] = useState("item");
  const [faded, setFaded] = useState("global");
  const dataset = useMemo(() => {
    const dataset = data.chart.times.map(({ hour }) => {
      const counters = Object.entries(data.chart.items).map(([key, values]) => {
        const entry = values.find((item) => item.hour === hour);
        return { key, counter: entry ? entry.counter : 0 };
      });
      // Sort by counter value descending
      counters.sort((a, b) => b.counter - a.counter);

      return {
        hour,
        top: counters[0] ? counters[0].counter : null,
        second: counters[1] ? counters[1].counter : null,
        third: counters[2] ? counters[2].counter : null,
      };
    });
    return dataset;
  }, [data]);

  return (
    <WrappedLineChart
      className={`chart_container  overflow-hidden relative mt-[48px] ${
        rank ? "bg-[--primary-bg]  p-[20px]" : ""
      } rounded-xl`}
    >
      <div className=" flex justify-start items-center gap-[2rem] mb-5 relative ">
        <Link
          className="text-white font-bold text-[28px] rt_charthome"
          style={{
            fontSize: `${fontsize}px`,
          }}
        >
          #zingchart
        </Link>
        <div
          className="rounded-[50%] bg-white flex justify-center items-center cursor-pointer"
          style={{
            width: `${dimension}px`,
            height: `${dimension}px`,
          }}
        >
          <icons.playsharp
            className=" ml-[2px]"
            style={{
              fontSize: `${playbtn}px`,
            }}
          ></icons.playsharp>
        </div>
      </div>
      <div className=" flex item-center w-full flex-auto relative  max-1130:flex-col-reverse">
        {rank && (
          <div className="rank w-[40%]  max-1130:w-full items-center">
            {data?.items?.slice(0, 3).map((song, index) => (
              <div
                className={`chart_top flex items-center  rounded py-[10px] px-[15px] mb-[10px]
                cursor-pointer bg-[--alpha-bg] hover:translate-x-[5px] transition-all ease-linear duration-200
                  `}
                key={song.encodeId}
              >
                <div className="mr-[15px] shrink-0 flex items-center justify-center">
                  <span
                    className={`top_num text-[32px] font-roboto w-[22px]  font-black leading-none  ${
                      index == 0
                        ? "is_top_1"
                        : index == 1
                        ? "is_top_2"
                        : index == 2
                        ? "is_top_3"
                        : "stroke_primary"
                    }`}
                  >
                    {index + 1}
                  </span>
                </div>
                <div className="song_info flex w-full  items-center justify-start gap-2">
                  <div className="relative w-[60px] h-[60px] rounded-[8px] overflow-hidden">
                    <LazyLoadImage
                      alt=""
                      src={song.thumbnailM}
                      className="w-full h-full object-cover"
                      effect="blur"
                      wrapperProps={{
                        // If you need to, you can tweak the effect transition using the wrapper style.
                        style: { transitionDelay: "1s" },
                      }}
                    />
                  </div>
                  <div className="title text-white">
                    <div className="title text-[14px] leading-[1.3] font-medium">
                      {song?.title}
                    </div>
                    <div className="text-[12px] text-white opacity-40">
                      {song?.artistsNames}
                    </div>
                  </div>
                </div>
                <div className="percent ml-[15px] flex text-[16px] font-bold text-white ">
                  30%
                </div>
              </div>
            ))}
            <div className="button  flex justify-center items-center mt-[5px] ">
              <Link
                to={"/zing-chart"}
                className="py-[5px] px-[25px] rounded-[28px] border-white border border-solid text-center text-white text-[14px] hover:bg-white hover:bg-opacity-15"
              >
                Xem thêm
              </Link>
            </div>
          </div>
        )}
        <div className="chart w-0 flex-auto max-1130:w-full  relative">
          <LineChart
            dataset={dataset}
            xAxis={[
              {
                scaleType: "point",
                dataKey: "hour",
                valueFormatter: (time) => (time % 2 == 0 ? time + ":00" : ""),
              },
            ]}
            series={[
              {
                id: `${Object.keys(data.chart.items)[0]}`,
                label: `${
                  data.items.find(
                    (item) => item.encodeId === Object.keys(data.chart.items)[0]
                  )?.title
                }`,
                dataKey: "top",
                showMark: true,
                color: "#4a90e2",
                highlightScope: {
                  highlighted,
                  faded,
                },
              },
              {
                id: `${Object.keys(data.chart.items)[1]}`,
                label: `${
                  data.items.find(
                    (item) => item.encodeId === Object.keys(data.chart.items)[1]
                  )?.title
                }`,
                dataKey: "second",
                showMark: true,
                color: "#50e3c2",
                highlightScope: {
                  highlighted,
                  faded,
                },
              },
              {
                id: `${Object.keys(data.chart.items)[2]}`,
                label: `${
                  data.items.find(
                    (item) => item.encodeId === Object.keys(data.chart.items)[2]
                  ).title
                }`,
                dataKey: "third",
                showMark: true,
                color: "#e35050",
                highlightScope: {
                  highlighted,
                  faded,
                },
              },
            ]}
            sx={{
              [`.${axisClasses.root}`]: {
                [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                  stroke: "transparent",
                },
                [`.${axisClasses.tickLabel}`]: {
                  fill: "#fff",
                },
              },
              [` .${axisClasses.tickLabel}`]: {
                fill: "#fff",
              },
              [`.${axisClasses.left} .${axisClasses.label}`]: {
                transform: "translateX(-10px)",
              },
              [`.${chartsGridClasses.line}`]: {
                strokeDasharray: "6 2",
                strokeWidth: 1,
                stroke: "rgba(225,225,225,0.1)",
              },
              [` .${chartsAxisHighlightClasses.root}`]: {
                display: "block",
                stroke: "#fff",
              },
            }}
            height={320}
            tooltip={{ trigger: "item" }}
            margin={{ top: -30 }}
            leftAxis={null}
            grid={{ horizontal: true }}
            legend={{ hidden: true }}
            highlightedItem={highlightedItem}
            onHighlightChange={setHighLightedItem}
          />
        </div>
      </div>
    </WrappedLineChart>
  );
};
const WrappedLineChart = styled.div``;
export default LineChartCp;
