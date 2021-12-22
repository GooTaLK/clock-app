import clockDefaultFormat from "../../data/clock/clock_default_format.json";

import { formatTo12h, formatTo24h } from "../helpers/date_formater.js";
import { getLocalData } from "../helpers/JSONAndLocalStorage";

import { checkAlarms } from "./alarm";
import { switchClockFormatButton } from "./header_funtionalities";

const clockState = {
  timeToShow: null,
  formatType: clockDefaultFormat.formatType,
};
const secondaryClocksState = getLocalData("clock-data") || [];

const $clock = document.querySelectorAll(".display-clock");

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

  return clockState.formatType;
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

const getInfoFromTimeZone = (timeZone, date = new Date()) => {
  const timeZoneSplit = timeZone.split("/");
  const area = timeZoneSplit[timeZoneSplit.length - 2].replaceAll("_", " ");
  const local = timeZoneSplit[timeZoneSplit.length - 1].replaceAll("_", " ");

  const is24h = clockState.formatType === "24h";
  const strTime = date.toLocaleString(is24h ? "en-GB" : "en-US", {
    timeZone: `${timeZone}`,
  });

  const formatStrTime = () => {
    if (!is24h) return strTime;

    const strTimeSplit = strTime.split("/");
    const firstEl = strTimeSplit.shift();
    strTimeSplit.splice(1, 0, firstEl);

    return strTimeSplit.join("/");
  };

  const timeDescription = () => {
    const dayDiff = new Date(formatStrTime()).getDay() - date.getDay();
    const replaceDate = (text) =>
      strTime.replace(/\d\d?\/\d\d?\/\d{4}, /, text);

    if (dayDiff === 0) return replaceDate("");
    if (dayDiff === 1 || dayDiff === -6) return replaceDate("Tomorrow, ");
    if (dayDiff === -1 || dayDiff === 6) return replaceDate("Yesterday, ");
  };

  return { area, local, strTimeDescription: timeDescription() };
};

const getInfoFromStrTimeDescription = (strTimeDescription) => {
  const format12h = /(AM|PM)$/.test(strTimeDescription);

  const meridiem = format12h ? strTimeDescription.match(/(AM|PM)$/)[0] : null;
  const relativeDay = /^[A-Z]+/i.test(strTimeDescription)
    ? strTimeDescription.match(/^[A-Z]+/i)[0]
    : "Today";
  let time = strTimeDescription.match(/\d+:\d+:\d+/)[0];

  time = time.replace(/:\d\d$/, "");

  return { meridiem, time, relativeDay };
};

const updateSecondaryClocks = () => {
  if (secondaryClocksState.length === 0) return;

  secondaryClocksState.forEach(({ timeZone }) => {
    const $clock = document.querySelector(
      `.secondary-clock[data-clock-time-zone='${timeZone}']`
    );
    const $meridiem =
      $clock.querySelector(".secondary-clock__meridiem") || null;
    const $relativeDay = $clock.querySelector(".secondary-clock__relative-day");
    const $time = $clock.querySelector(".secondary-clock__time");

    const { strTimeDescription } = getInfoFromTimeZone(timeZone);
    const { meridiem, time, relativeDay } =
      getInfoFromStrTimeDescription(strTimeDescription);

    $meridiem && ($meridiem.textContent = meridiem);
    $time.textContent = time;
    $relativeDay.textContent = relativeDay;
  });
};

const initClockAndAlarm = () => {
  updateClock();
  setInterval(() => {
    updateClock();
    checkAlarms();
  }, 1000);
};

const initSecondaryClocks = () =>
  setInterval(() => updateSecondaryClocks(), 1000);

const initClockFormat = () => {
  const clockFormat = localStorage.getItem("clock-format");

  const initClockFormatFunctions = (format) => {
    setClockFormat(format);
    switchClockFormatButton(format);
  };

  if (!clockFormat) return initClockFormatFunctions(clockState.formatType);

  clockFormat === "12h"
    ? initClockFormatFunctions("12h")
    : initClockFormatFunctions("24h");
};

export {
  initClockAndAlarm,
  initSecondaryClocks,
  initClockFormat,
  setClockFormat,
  getInfoFromTimeZone,
  getInfoFromStrTimeDescription,
  toggleClockFormat,
  updateClock,
  clockState,
  secondaryClocksState,
};
