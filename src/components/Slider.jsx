import React, { memo, useState, useEffect } from "react";

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

    useEffect(() => {
      setSliderVal(value);
    }, [value]);

    const changeCallback = (e) => {
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
        <h3 className={styles.slider_title}>{title}</h3>
        <div className={styles.text_input_container}>
          <input
            type="number"
            className={styles.text_input}
            value={slidertype === "Payment" ? firstPayment : sliderVal}
            onChange={changeCallback}
            placeholder={
              slidertype === "Payment" ? firstPayment + " ₽" : sliderVal
            }
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
        ></input>
        {isDisabled ? <div className={styles.disable_overlay}></div> : ""}
      </div>
    );
  }
);
export default Slider;
