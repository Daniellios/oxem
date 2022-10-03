import React, { memo, useState, useEffect, useRef } from "react";

import styles from "../styles/Slider.module.scss";

const Slider = memo(
  ({
    onSliderChange,
    isDisabled,
    firstPayment,
    slidertype,
    title,
    value,
    valueType,
    min,
    max,
    ...passedProps
  }) => {
    const [sliderVal, setSliderVal] = useState(value);
    const rangeFollowRef = useRef();

    useEffect(() => {
      setSliderVal(value);
    }, [value]);

    // РАССЧЕТ ШИРИНЫ КАСТОМНОГО ИНТПУТА
    // useEffect(() => {
    //   rangeFollowRef.current.style.backgroundSize =
    //     ((sliderVal - min) * 100) / (max - min) + "% 100%";
    // }, [value, sliderVal]);

    const changeCallback = (e) => {
      if (e.target.value === "") {
        onSliderChange(min);
      } else {
        if (parseInt(e.target.value) > max + max) {
          onSliderChange(max);
        } else if (parseInt(e.target.value) < min - min) {
          onSliderChange(min);
        } else {
          onSliderChange(e.target.value);
        }
      }
    };

    const setCorectValue = (e) => {
      if (parseInt(e.target.value) > max) {
        onSliderChange(max);
      } else if (parseInt(e.target.value) < min) {
        onSliderChange(min);
      } else {
        onSliderChange(e.target.value);
      }
    };

    return (
      <div className={styles.container}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.text_input_container}>
          <input
            type="number"
            className={styles.text_input}
            value={slidertype === "Payment" ? firstPayment : sliderVal}
            onChange={changeCallback}
            placeholder={
              slidertype === "Payment" ? firstPayment + " ₽" : sliderVal
            }
            onBlur={setCorectValue}
            title={"text" + valueType}
            disabled={slidertype === "Payment" ? true : isDisabled}
          ></input>

          <div className={styles.value_container}>
            {slidertype === "Payment" ? (
              <>
                <input
                  type="number"
                  onChange={changeCallback}
                  className={styles.value_input_percent}
                  value={sliderVal}
                  disabled={isDisabled}
                  title={"percent" + valueType}
                ></input>
                <span className={styles.percent_sign}> {valueType}</span>
              </>
            ) : (
              valueType
            )}
          </div>
        </div>

        <input
          type="range"
          value={sliderVal}
          className={styles.range}
          onChange={changeCallback}
          min={min}
          max={max}
          {...passedProps}
          disabled={isDisabled}
          title={"range" + valueType}
        ></input>
        {/* КАСТОМНАЯ ЛИНИЯ ИНПУТА, закомментил по причине того,
        что мне не нравится как линия немного вылетает в бок и не очень красиво получается 
        но в целом работает нормально*/}
        {/* <div ref={rangeFollowRef} className={styles.range_follower}></div> */}
        {isDisabled ? <div className={styles.disable_overlay}></div> : ""}
      </div>
    );
  }
);
export default Slider;
