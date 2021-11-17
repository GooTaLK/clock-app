import clockDefaultFormat from "../../data/clock/clock_default_format.json";

import { formatTo12h, formatTo24h } from "../helpers/date_formater.js";

import { checkAlarms } from "./alarm";

const clockState = {
  timeToShow: null,
  formatType: clockDefaultFormat.formatType,
};

const $clock = document.querySelectorAll(".display-clock");
const $clockBackground = document.getElementById("clockBackground");

const setClockFormat = (format) => {
  if (format === "24h") {
    clockState.formatType = "24h";
    localStorage.setItem("clock-format", "24h");
  } else if (format === "12h") {
    clockState.formatType = "12h";
    localStorage.setItem("clock-format", "12h");
  }

  updateClock();
};

const toggleClockFormat = (
  params = { if24h: () => null, if12h: () => null }
) => {
  const is12hFormat = clockState.formatType === "12h";

  if (is12hFormat) {
    setClockFormat("24h");
    params.if24h();
  } else {
    setClockFormat("12h");
    params.if12h();
  }
};

const updateClock = () => {
  clockState.timeToShow =
    clockState.formatType === "24h"
      ? formatTo24h(new Date(), { allowSeconds: false })
      : formatTo12h(new Date(), { allowSeconds: false });

  const currentTime = clockState.timeToShow;
  $clock.forEach((el) => {
    if (
      !el.classList.contains("header__clock") &&
      clockState.formatType !== "24h"
    ) {
      const timeSplit = currentTime.split(" ");
      el.innerHTML = `${timeSplit[0]}<span> ${timeSplit[1]}</span>`;
      return;
    }

    el.textContent = currentTime;
  });
};

const rotateEffect = (el, deg) =>
  el.style.setProperty("transform", `rotate(${deg}deg)`);

const setBorderEffect = () => {
  const time = new Date().toLocaleTimeString();
  const seconds = time.match(/:\d{1,2}$/)[0].replace(":", "");
  const deg = 6 * seconds;

  rotateEffect($clockBackground, deg);
};

const initClockAndAlarm = () => {
  updateClock();
  setBorderEffect();
  setInterval(() => {
    updateClock();
    checkAlarms();
  }, 1000);
};

const initClockFormat = () => {
  const clockFormat = localStorage.getItem("clock-format");
  if (clockFormat === undefined) return setClockFormat(clockState.formatType);
  clockFormat === "12h" ? setClockFormat("12h") : setClockFormat("24h");
};

export {
  initClockAndAlarm,
  initClockFormat,
  setClockFormat,
  toggleClockFormat,
  updateClock,
  clockState,
};
