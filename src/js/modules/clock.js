import { clockStore } from "../redux_stores/clock_store.js";
import clockActions from "../redux_actions/clock_actions.js";
import useOn from "../helpers/use_on.js";

const $clock = document.querySelectorAll(".display-clock");
const $setFormatBtn = document.querySelector(".change-clock-format");
const $setFormatText = $setFormatBtn.querySelector(".clock-format-text");

const updateClock = () => {
  clockStore.dispatch(clockActions.UPDATE_TIME_WITHOUT_SEC);

  const currentTime = clockStore.getState().timeToShow;
  $clock.forEach((el) => (el.textContent = currentTime));
};

const initClockDisplay = () => {
  updateClock();
  setInterval(updateClock, 1000);
};

const clockSettings = () => {
  useOn({
    typeEvent: "click",
    selector: ".change-clock-format",
    callback: () => {
      const formatType = clockStore.getState().formatType;
      const is24hFormat = formatType === "24h";

      if (is24hFormat) {
        clockStore.dispatch(clockActions.SET_FORMAT_TO_12);
        $setFormatBtn.classList.add("lk-check_btn--active");
        $setFormatText.textContent = `Format 12h: `;
      } else {
        clockStore.dispatch(clockActions.SET_FORMAT_TO_24);
        $setFormatBtn.classList.remove("lk-check_btn--active");
        $setFormatText.textContent = `Format 24h: `;
      }

      updateClock();
    },
  });
};

export { initClockDisplay, clockSettings };
