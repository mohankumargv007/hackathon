import React, { useState } from "react";
import _get from 'lodash/get';
import Stack from '@mui/material/Stack';
import { useKeenSlider } from "keen-slider/react";

export default function Fixture(props) {
  const fixture = _get(props, "fixture", {});
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      initial: 0,
      slideChanged(s) {
        setCurrentSlide(s.track.details.rel)
      },
      created() {
        setLoaded(true)
      },
    }
  )

  return (
    <div className="fixture-details">
      <Stack spacing={1}>
        <h3 className="no-margig">{fixture.name}</h3>
        {fixture.type &&<p><b>Type: </b>{fixture.type}</p>}
        {fixture.component_length && <p><b>Length: </b>{fixture.component_length}</p>}
        {fixture.component_width && <p><b>Width: </b>{fixture.component_width}</p>}
        {fixture.component_height && <p><b>Height: </b>{fixture.component_height}</p>}
        <div className="navigation-wrapper">
          <div ref={sliderRef} className="keen-slider">
            {fixture.front_image &&
              <div className="keen-slider__slide number-slide1">
                <img src={fixture.front_image} width="100%" />
              </div>
            }
            {fixture.cad_image &&
              <div className="keen-slider__slide number-slide2">
                <img src={fixture.cad_image} width="100%" />
              </div>
            }
            {fixture.lateral_image &&
              <div className="keen-slider__slide number-slide3">
                <img src={fixture.lateral_image} width="100%" />
              </div>
            }
          </div>
          {loaded && instanceRef.current && (
            <>
              <Arrow
                left
                onClick={(e) =>
                  e.stopPropagation() || instanceRef.current?.prev()
                }
                disabled={currentSlide === 0}
              />

              <Arrow
                onClick={(e) =>
                  e.stopPropagation() || instanceRef.current?.next()
                }
                disabled={
                  currentSlide ===
                  instanceRef.current.track.details.slides.length - 1
                }
              />
            </>
          )}
        </div>
        {loaded && instanceRef.current && (
          <div className="dots">
            {[
              ...Array(instanceRef.current.track.details.slides.length).keys(),
            ].map((idx) => {
              return (
                <button
                  key={idx}
                  onClick={() => {
                    instanceRef.current?.moveToIdx(idx)
                  }}
                  className={"dot" + (currentSlide === idx ? " active" : "")}
                ></button>
              )
            })}
          </div>
        )}
      </Stack>
    </div>
  )
}


function Arrow(props) {
  const disabeld = props.disabled ? " arrow--disabled" : ""
  return (
    <svg
      onClick={props.onClick}
      className={`arrow ${
        props.left ? "arrow--left" : "arrow--right"
      } ${disabeld}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      {props.left && (
        <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
      )}
      {!props.left && (
        <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
      )}
    </svg>
  )
}