import clockDefaultFormat from "../../data/clock/clock_default_format.json";

import useOn from "../helpers/use_on.js";
import { formatTo12h, formatTo24h } from "../helpers/date_formater.js";

import { checkAlarms } from "./alarm";

const clockState = {
  timeToShow: null,
  formatType: clockDefaultFormat.formatType,
};

const $clock = document.querySelectorAll(".display-clock");
const $setFormatBtn = document.querySelector(".change-clock-format");

const setClockFormat = (format) => {
  if (format === "24h") {
    clockState.formatType = "24h";
    $setFormatBtn.classList.add("lk-check_btn--active");
  } else if (format === "12h") {
    clockState.formatType = "12h";
    $setFormatBtn.classList.remove("lk-check_btn--active");
  }
};

const updateClock = () => {
  clockState.timeToShow =
    clockState.formatType === "24h"
      ? formatTo24h(new Date(), { allowSeconds: false })
      : formatTo12h(new Date(), { allowSeconds: false });

  const currentTime = clockState.timeToShow;
  $clock.forEach((el) => (el.textContent = currentTime));
};

const initClockAndAlarm = () => {
  updateClock();
  setInterval(() => {
    updateClock();
    checkAlarms();
  }, 1000);
};

const initClockFormat = () => {
  const clockFormat = localStorage.getItem("clock-format");
  if (clockFormat === undefined)
    return setClockFormat(clockState.formatType)(clockFormat === "12h")
      ? setClockFormat("12h")
      : setClockFormat("24h");
};

const clockSettings = () => {
  useOn({
    typeEvent: "click",
    selector: ".change-clock-format",
    callback: () => {
      const is12hFormat = clockState.formatType === "12h";

      if (is12hFormat) {
        setClockFormat("24h");
        localStorage.setItem("clock-format", "24h");
      } else {
        setClockFormat("12h");
        localStorage.setItem("clock-format", "12h");
      }

      updateClock();
    },
  });
};

export { initClockAndAlarm, initClockFormat, clockSettings, clockState };
