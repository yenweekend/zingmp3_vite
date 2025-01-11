import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import icons from "../utils/icons";
import SongSocial from "./SongSocial";
import { use } from "react";
import styled from "styled-components";
let timeId;
const SlideShow = ({ data }) => {
  const slideRef = useRef([]);
  const [index, setIndex] = useState(0);
  const [slidesToShow, setSlideToShow] = useState(3);
  const updateSlideToShow = useCallback(() => {
    if (window.innerWidth <= 1130) {
      setSlideToShow(2);
    } else {
      setSlideToShow(3);
    }
  });
  const renderSlides = useMemo(() => {
    return Array.from(
      { length: slidesToShow },
      (_, i) => (index + i) % data.length
    );
  }, [data, index, slidesToShow]);
  const handleNext = useCallback(() => {
    timeId && clearInterval(timeId);
    timeId = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % data.length);
    }, 8000);
    setIndex((prev) => (prev + 1 + data.length) % data.length);
  });
  const handlePrev = useCallback(() => {
    timeId && clearInterval(timeId);
    timeId = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % data.length);
    }, 8000);
    setIndex((prev) => (prev - 1 + data.length) % data.length);
  });
  useEffect(() => {
    updateSlideToShow();
    window.addEventListener("resize", updateSlideToShow);
    return () => {
      window.removeEventListener("resize", updateSlideToShow);
    };
  }, []);
  useEffect(() => {
    timeId = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % data.length);
    }, 8000);
    return () => {
      timeId && clearInterval(timeId);
    };
  }, []);
  const addToRefs = (el) => {
    if (el && !slideRef.current.includes(el)) {
      slideRef.current.push(el);
    }
  };
  useEffect(() => {
    slideRef.current.forEach((el, idx) => {
      el.classList.remove(
        "first",
        "middle",
        "last",
        "next",
        "first-2",
        "last-2"
      );
      if (renderSlides.includes(idx) && renderSlides.length === 3) {
        if (idx === renderSlides[0]) el.classList.add("first");
        else if (idx === renderSlides[1]) el.classList.add("middle");
        else if (idx === renderSlides[2]) el.classList.add("last");
      } else if (renderSlides.includes(idx) && renderSlides.length === 2) {
        if (idx === renderSlides[0]) el.classList.add("first-2");
        else if (idx === renderSlides[1]) el.classList.add("last-2");
      } else {
        el.classList.add("next");
      }
    });
  }, [slideRef, renderSlides]);
  return (
    <SlideShowStyled className="relative">
      <div className="h-[150px] w-full ">
        <div className="social flex-nowrap relative  flex justify-center mx-[-12px] h-full">
          {data.map((song, index) => (
            <div
              className="min-1130:w-[calc((100%/3))] w-[calc((100%/2))] px-[12px] flex-shrink-0 slide-show absolute "
              key={song.encodeId}
              ref={addToRefs}
            >
              <SongSocial data={song} index={index}></SongSocial>
            </div>
          ))}
        </div>
      </div>
      <div
        className="absolute top-[50%] translate-y-[-50%] cursor-pointer z-[80] right-[98%] hover:translate-y-[-25px] transition-all ease-linear duration-150 z-2"
        onClick={handlePrev}
      >
        <button className="w-10 h-10 rounded-full primary-bg flex items-center justify-center control-slide ">
          <icons.arrowLeft className="primary-text"></icons.arrowLeft>
        </button>
      </div>
      <div
        className="absolute top-[50%] translate-y-[-50%] cursor-pointer z-[80] left-[98%] hover:translate-y-[-25px] transition-all ease-linear duration-150 z-2"
        onClick={handleNext}
      >
        <button className="w-10 h-10 rounded-full primary-bg flex items-center justify-center control-slide ">
          <icons.arrowRight className="primary-text"></icons.arrowRight>
        </button>
      </div>
    </SlideShowStyled>
  );
};
const SlideShowStyled = styled.div`
  @keyframes opa {
    from {
      transform: translate(20%);
      opacity: 0;
      z-index: 0;
    }
    to {
      transform: translate(100%);

      opacity: 1;
      z-index: 1;
    }
  }
  .first {
    transform: translateX(-100%);
    z-index: 1;
    opacity: 1;
  }
  .middle {
    transform: translateX(0px);
    z-index: 1;
    opacity: 1;
  }
  .last {
    transform: translate(100%);
    opacity: 1;
    z-index: 1;
    /* animation: opa linear 0.3s forwards; */
  }
  /* .prev {
    transform: translateX(-20%);
    opacity: 0;
    z-index: 0;
  } */
  .next {
    transform: translateX(20%);
    opacity: 0;
    z-index: 0;
  }
  .first-2 {
    transform: translateX(-50%);
    z-index: 1;
    opacity: 1;
  }
  .last-2 {
    transform: translate(50%);
    opacity: 1;
    z-index: 1;
    /* animation: opa linear 0.3s forwards; */
  }
`;
export default SlideShow;
