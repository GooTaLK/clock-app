import useOn from "../helpers/use_on.js";
import { formatTo12h, formatTo24h } from "../helpers/date_formater.js";

import clockState from "../states/clock.js";

const $clock = document.querySelectorAll(".display-clock");
const $setFormatBtn = document.querySelector(".change-clock-format");

const updateClock = () => {
  clockState.timeToShow =
    clockState.formatType === "24h"
      ? formatTo24h(new Date(), { allowSeconds: false })
      : formatTo12h(new Date(), { allowSeconds: false });

  const currentTime = clockState.timeToShow;
  $clock.forEach((el) => (el.textContent = currentTime));
};

const initClockDisplay = () => {
  updateClock();
  setInterval(updateClock, 1000);
};

const initClockSettings = () => {
  const clockFormat = localStorage.getItem("clock-format");

  if (!clockFormat || clockFormat === "12h") return;

  clockState.formatType = "24h";
  $setFormatBtn.classList.add("lk-check_btn--active");
};

const clockSettings = () => {
  useOn({
    typeEvent: "click",
    selector: ".change-clock-format",
    callback: () => {
      const is12hFormat = clockState.formatType === "12h";

      if (is12hFormat) {
        clockState.formatType = "24h";
        $setFormatBtn.classList.add("lk-check_btn--active");
        localStorage.setItem("clock-format", "24h");
      } else {
        clockState.formatType = "12h";
        $setFormatBtn.classList.remove("lk-check_btn--active");
        localStorage.setItem("clock-format", "12h");
      }

      updateClock();
    },
  });
};

export { initClockDisplay, initClockSettings, clockSettings };
