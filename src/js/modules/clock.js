import { clockStore } from "../redux_stores/clock_store.js";
import clockActions from "../redux_actions/clock_actions.js";
import useOn from "../helpers/use_on.js";

const $clock = document.querySelectorAll(".display-clock");
const $setFormatBtn = document.querySelector(".change-clock-format");

const updateClock = () => {
  clockStore.dispatch(clockActions.UPDATE_TIME_WITHOUT_SEC);

  const currentTime = clockStore.getState().timeToShow;
  $clock.forEach((el) => (el.textContent = currentTime));
};

const initClockDisplay = () => {
  updateClock();
  setInterval(updateClock, 1000);
};

const initClockSettings = () => {
  const clockFormat = localStorage.getItem("clock-format");

  if (!clockFormat || clockFormat === "12h") return;

  clockStore.dispatch(clockActions.SET_FORMAT_TO_24);
  $setFormatBtn.classList.add("lk-check_btn--active");
};

const clockSettings = () => {
  useOn({
    typeEvent: "click",
    selector: ".change-clock-format",
    callback: () => {
      const formatType = clockStore.getState().formatType;
      const is12hFormat = formatType === "12h";

      if (is12hFormat) {
        clockStore.dispatch(clockActions.SET_FORMAT_TO_24);
        $setFormatBtn.classList.add("lk-check_btn--active");
        localStorage.setItem("clock-format", "24h");
      } else {
        clockStore.dispatch(clockActions.SET_FORMAT_TO_12);
        $setFormatBtn.classList.remove("lk-check_btn--active");
        localStorage.setItem("clock-format", "12h");
      }

      updateClock();
    },
  });
};

export { initClockDisplay, initClockSettings, clockSettings };
