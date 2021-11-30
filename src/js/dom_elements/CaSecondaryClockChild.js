import { getInfoFromStrTimeDescription } from "../modules/clock";

const CaSecondaryClockChild = ({ strTimeDescription }) => {
  const $container = document.createElement("div");
  const $meridiem = document.createElement("span");
  const $time = document.createElement("span");
  const $relativeDay = document.createElement("span");

  const { meridiem, time, relativeDay } =
    getInfoFromStrTimeDescription(strTimeDescription);

  meridiem && ($meridiem.textContent = meridiem);

  $meridiem.classList.add("secondary-clock__meridiem");

  $time.classList.add("secondary-clock__time");
  $time.textContent = time;

  $relativeDay.classList.add("secondary-clock__relative-day");
  $relativeDay.textContent = relativeDay;

  $container.classList.add("secondary-clock__container");

  $container.append($meridiem, $time, $relativeDay);

  return $container;
};

export default CaSecondaryClockChild;
