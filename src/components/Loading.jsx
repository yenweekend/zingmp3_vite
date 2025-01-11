import React from "react";
import styled from "styled-components";

const Loading = () => {
  return (
    <LoadingStyled>
      <div className="w-full h-[calc(100vh-70px)] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <svg
            width="48px"
            className="azt-svg-loading jobing-j"
            xmlns="http://www.w3.org/2000/svg"
            xmlSpace="preserve"
            style={{ enableBackground: "new 0 0 109 92.9" }}
            viewBox="0 0 109 92.9"
          >
            <path
              d="M90.8 52c3.5 6.2 7.1 11.7 9.8 17.7 4.4 9.7-2.9 20.7-13.8 20.9-11.8.2-23.7.2-35.5 0-11-.1-17.6-12.2-12-21.7.4-.8 1.8-1.4 2.7-1.4 9.9-.1 19.7-.1 29.6-.1 9.8 0 15.9-4.6 18.7-14 .1-.2.2-.5.5-1.4z"
              className="azt-svg-loading jobing-j"
            ></path>
            <path
              d="M39.6 90.3c-6.8 0-13.8.8-20.5-.2-9.7-1.4-15-12.8-10.3-21.3 5.9-10.9 12.1-21.6 18.5-32.2 5.5-9 18.6-8.7 24.2.2.7 1.1.8 1.9.1 3.1C46.7 48.3 42 57 36.8 65.3c-5.3 8.4-3.8 18.8 2.5 24.6.2 0 .2.3.3.4z"
              className="azt-svg-loading jobing-j"
            ></path>
            <path d="M32.5 27.3c3.3-5.7 6.1-11 9.4-16 5.9-9.1 19.4-9.2 25.1 0 6.5 10.4 12.6 21 18.3 31.7 4.8 9-1.5 19.9-11.5 20.7-1.6.1-2.6-.2-3.5-1.8-4.8-8.6-9.8-17.1-14.7-25.6-4.7-8.3-12.5-11.6-21.7-9.2-.3 0-.6 0-1.4.2z"></path>
          </svg>
          <span className="text-[14px] font-medium primary-text">
            Đang load dữ liệu ...
          </span>
        </div>
      </div>
    </LoadingStyled>
  );
};
const LoadingStyled = styled.div`
  @keyframes dash {
    0% {
      stroke-dashoffset: -300;
    }
    30% {
      stroke-dashoffset: 0;
    }
    60% {
      stroke-dashoffset: 0;
    }
    100% {
      stroke-dashoffset: -300;
    }
  }
  .azt-svg-loading {
    stroke-width: 2px;
    stroke-dasharray: 300;
    stroke-dashoffset: 0;
    animation: dash 1.5s linear 0.1s infinite alternate;
    --tw-text-opacity: 1;
    /* --color-primary: 30, 64, 175; */
    stroke: var(--text-primary);
    fill: transparent;
  }
`;
export default Loading;
