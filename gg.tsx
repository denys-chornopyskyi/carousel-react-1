import React, {useState, useRef} from 'react';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import './Slider.css';

const slides = ['Слайд 1', 'Слайд 2', 'Слайд 3'];

export default function Slider() {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const nodeRefs = useRef<{ [key: number]: React.RefObject<HTMLDivElement> }>(
    {});
  const getNodeRef = (key: number) => {
    if (!nodeRefs.current[key]) {
      nodeRefs.current[key] = React.createRef<HTMLDivElement>();
    }
    return nodeRefs.current[key];
  };

  const handleSlide = (dir: 'left' | 'right') => {
    const nextIndex = (index + (dir === 'right' ? 1 : -1) + slides.length) % slides.length;
    setPrevIndex(index);
    setIndex(nextIndex);
    setDirection(dir);
  };

  return (
    <div className="slider-container">
      <button onClick={() => handleSlide('left')}>← Назад</button>
      <button onClick={() => handleSlide('right')}>Вперёд →</button>

      <div className="slider-wrapper">
        <TransitionGroup component={null}>
          {prevIndex !== null && (
            <CSSTransition
              key={`prev-${prevIndex}`}
              in={false}
              timeout={500}
              classNames={direction === 'right' ? 'slide-left' : 'slide-right'}
              nodeRef={getNodeRef(prevIndex)}
              mountOnEnter
              unmountOnExit
              onExited={() => setPrevIndex(null)}
            >
              <div ref={getNodeRef(prevIndex)} className="slide">
                {slides[prevIndex]}
              </div>
            </CSSTransition>
          )}

          <CSSTransition
            key={`current-${index}`}
            in={true}
            timeout={500}
            classNames={direction === 'right' ? 'slide-left' : 'slide-right'}
            nodeRef={getNodeRef(index)}
            mountOnEnter
            unmountOnExit
          >
            <div ref={getNodeRef(index)} className="slide">
              {slides[index]}
            </div>
          </CSSTransition>
        </TransitionGroup>
      </div>
    </div>
  );
}
