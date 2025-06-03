import {ArrowBigLeft, ArrowBigRight, Circle, CircleDot} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import "./Carousel.css";
import type {settingsProps} from "../../App";
import {wait} from "./utils/timeout.ts";

interface CarouselProps extends settingsProps {
  imageUrls: string[];
}

const Carousel = ({imageUrls, settings, setSettings}: CarouselProps) => {
  const [imageIndex, setImageIndex] = useState<number>(0);
  const [renderQueue, setRenderQueue] = useState<string[]>(
    [imageUrls[imageIndex]])


  const currentTarget = useRef<HTMLImageElement>(null)
  const targetIndex = useRef<1 | 2 | 0>(0)
  const [targetIndexState, setTargetIndexState] = useState(false)

  const showPrevImage = () => {
    let i = 0
    setImageIndex((index) => {
      if (index === 0) {
        i = imageUrls.length - 1
      } else {
        i = index - 1
      }
      return i;
    });
    setRenderQueue((prevState) => {
      const tmp = [...prevState];
      for (let j = 0; j < imageUrls.length; j++) {
        if (j === i) {
          tmp[j] = imageUrls[j]
          console.log(j)
        }
      }
      console.log(tmp)

      return tmp
    })

  };


  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        async function loop() {
          await wait(10000)
          setRenderQueue((prevState) => {
            if (targetIndex) {

              // console.log(prevState.slice(1))
              return prevState.slice(1)
            } else {
              return prevState.slice(0, 1)
            }
          })
          observer.disconnect()
        }

        setRenderQueue((prevState) => {
          if (!targetIndex.current) {

            console.log('obrazenij 1', prevState.slice(1))
            return prevState.slice(1)
          } else {
            console.log('obrazanij', prevState.slice(0, 1))
            return prevState.slice(0, 1)
          }
        })
        setSettings({...settings, animation: false})
        setTargetIndexState(false)
        observer.disconnect()


      }
    })
  }, {
    threshold: 0.05
  })
  // console.log(imageIndex)

  const showNextImageStrip = () => {
    setImageIndex((index) => {
      if (index === imageUrls.length - 1) return 0;
      return index + 1;
    });

  };
  // const showNextImageDeque = () => {
  //   let i = 0
  //   setImageIndex((index) => {
  //     if (index === imageUrls.length - 1) {
  //       i = 0
  //     } else {
  //       i = index + 1
  //     }
  //     return i;
  //   });
  //   if (renderQueue.length !== imageUrls.length) {
  //     setRenderQueue((prevState) => [...prevState, imageUrls[i + 1]])
  //   }
  //
  // }

  const showPrevImageDeque = () => {
    targetIndex.current = 1
    console.log(1)
    let currentIndex = imageIndex;
    setImageIndex((prevIndex) => {
      if (prevIndex === 0) {
        currentIndex = imageUrls.length - 1
      } else {
        currentIndex = prevIndex - 1
      }
      return currentIndex;
    })

    setRenderQueue((prevQueue) => [imageUrls[currentIndex], ...prevQueue])
  }

  const showNextImageDeque = () => {
    if (renderQueue.length > 1) return
    targetIndex.current = 0
    let currentIndex = imageIndex;
    setImageIndex((prevIndex) => {
      if (prevIndex === imageUrls.length - 1) {
        currentIndex = 0
      } else {
        currentIndex = prevIndex + 1
      }
      return currentIndex;
    })
    setRenderQueue((prevQueue) => [...prevQueue, imageUrls[currentIndex]])
  }

  console.log(renderQueue)
  useEffect(() => {
      let canceled = false;

      // async function loop() {
      //   while (!canceled && settings.autoReplay) {
      //     await wait(settings.autoReplayDelay)
      //     showNextImageDeque()
      //     if (settings.animation) {
      //       await wait(settings.animDuration)
      //     }
      //   }
      // }

      // console.log('currentTarget:', currentTarget.current)
      // console.log('targetIndex:', targetIndex.current)

      async function loop() {

        if (renderQueue.length === 2) {
          console.log(currentTarget.current)
          if (currentTarget.current) observer.observe(currentTarget.current)
          setTargetIndexState(true)
          console.log('konec')
        }

      }

      setSettings({...settings, animation: true})
      loop()
      // loop()
      return () => {
        canceled = true
      }
    },
    [renderQueue])
  // [settings.autoReplay, settings.animation]


  return (
    <div style={{position: "relative", width: "640px", height: "auto"}}>
      <div
        style={{
          display: "flex",
          overflow: "hidden",
          width: "100%",
          height: "100%",
        }}
      >
        {/*{settings.sliderLogic === 'strip' && imageUrls.map((url) => {*/}
        {/*  return <img*/}
        {/*    alt={`img-${url}`}*/}
        {/*    key={url}*/}
        {/*    src={url}*/}
        {/*    className="carousel-image"*/}
        {/*    style={{*/}
        {/*      translate: `${-100 * imageIndex}%`,*/}
        {/*      transition: settings.animation ? `translate ${settings.animDuration}ms ${settings.animationCurve}` : ''*/}
        {/*    }}*/}
        {/*  />*/}
        {/*})}*/}

        {settings.sliderLogic === 'deque' && renderQueue.map((url, index) => (
          <img
            alt={`img-${url}`}
            key={url}
            src={url}
            ref={index === 0 ? currentTarget : null}
            // ref={currentTarget}
            className="carousel-image"
            style={{
              translate: targetIndexState ? `${-100 * (renderQueue.length - 1)}%` : ``,
              transition: settings.animation ? `translate ${settings.animDuration}ms ${settings.animationCurve}` : ''
            }}
          />
        ))}
      </div>

      {settings.addControlBtns && (
        <>
          <button
            className="carousel-btn"
            onClick={showPrevImageDeque}
            style={{left: 0}}
          >
            <ArrowBigLeft/>
          </button>
          <button
            className="carousel-btn"
            onClick={settings.sliderLogic === 'strip' ? showNextImageStrip : showNextImageDeque}
            style={{right: 0}}
          >
            <ArrowBigRight/>
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
        {settings.addIndicators && imageUrls.map((_, index) => (
          <button
            key={index}
            className="carousel-dot-btn"
            onClick={() => setImageIndex(index)}
          >
            {index === imageIndex ? <CircleDot/> : <Circle/>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
