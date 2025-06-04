import { ArrowBigLeft, ArrowBigRight, Circle, CircleDot } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "./Carousel.css";
import type { settingsProps } from "../../App";
import { wait } from "./utils/timeout.ts";
import {
  CSSTransition,
  TransitionGroup,
  SwitchTransition,
} from "react-transition-group";
import React from "react";

interface CarouselProps extends settingsProps {
  imageUrls: string[];
}

const Carousel = ({ imageUrls, settings, setSettings }: CarouselProps) => {
  const [imageIndex, setImageIndex] = useState<number>(0);
  const [renderQueue, setRenderQueue] = useState<string[]>([
    imageUrls[imageIndex],
  ]);

const slideDirection = useRef<'next' | 'prev'>('prev')



  const setSlide = (newIndex) => {
    let tmpIndex = newIndex
    
    setImageIndex(tmpIndex)
    setRenderQueue([imageUrls[tmpIndex]])
  }


  const showNextImageDeque = () => {
    let currentIndex = imageIndex;
    setImageIndex((prevIndex) => {
      if (prevIndex === imageUrls.length - 1) {
        currentIndex = 0;
      } else {
        currentIndex = prevIndex + 1;
      }
      return currentIndex;
    });
    setRenderQueue((prevQueue) => [imageUrls[currentIndex]]);
  };

  console.log(renderQueue);
 

  const nodeRefs = useRef<{ [key: string]: React.RefObject<HTMLImageElement> }>(
    {}
  );

  const getNodeRef = (key: string): React.RefObject<HTMLImageElement> => {
    if (!nodeRefs.current[key]) {
      nodeRefs.current[key] = React.createRef<HTMLImageElement>();
    }
    return nodeRefs.current[key];
  };

  return (
    <div style={{ position: "relative", width: "640px", height: "auto" }}>
      <TransitionGroup
        style={{
          display: "flex",
          overflow: "hidden",
          width: "100%",
          height: "100%",
          position: 'relative',
        }}
      >
        {renderQueue.map((url) => (
          <CSSTransition
            key={url}
            classNames='fade'
            nodeRef={getNodeRef(url)}
            unmountOnExit
            timeout={500}
          >
            <img
              alt={`img-${url}`}
              src={url}
              ref={getNodeRef(url)}
              className="carousel-image"
            />
          </CSSTransition>
        ))}
      </TransitionGroup>

      {/* {renderQueue.map((url, index) => (
        <img
          alt={`img-${url}`}
          key={url}
          src={url}
          ref={index === 0 ? currentTarget : null}
          // ref={currentTarget}
          className="carousel-image"
          style={{
            translate: targetIndexState
              ? `${-100 * (renderQueue.length - 1)}%`
              : ``,
            transition: settings.animation
              ? `translate ${settings.animDuration}ms ${settings.animationCurve}`
              : "",
          }}
        />
      ))} */}

      {settings.addControlBtns && (
        <>
          <button
            className="carousel-btn"
            onClick={showNextImageDeque}
            style={{ left: 0 }}
          >
            <ArrowBigLeft />
          </button>
          <button
            className="carousel-btn"
            onClick={() => setSlide(imageIndex + 1)}
            style={{ right: 0 }}
          >
            <ArrowBigRight />
          </button>
        </>
      )}
      <div
        style={{
          position: "absolute",
          left: "50%",
          translate: "-50%",
          bottom: ".5rem",
          display: "flex",
          gap: ".5rem",
        }}
      >
        {settings.addIndicators &&
          imageUrls.map((_, index) => (
            <button
              key={index}
              className="carousel-dot-btn"
              onClick={() => setImageIndex(index)}
            >
              {index === imageIndex ? <CircleDot /> : <Circle />}
            </button>
          ))}
      </div>
    </div>
  );
};

export default Carousel;
