import { daysOfWeek, months } from "../helpers/date_utilities";

import CaBtnGroup from "../dom_elements/CaBtnGroup";
import CaSecondaryClockChild from "../dom_elements/CaSecondaryClockChild";
import { getInfoFromTimeZone, secondaryClocksState } from "./clock";

const $clockBackground = document.getElementById("clockBackground");
const $clockLocation = document.querySelector(".clock-info__location");
const $clockLocalDate = document.querySelector(".clock-info__local-date");
const $clockButtons = document.getElementById("clockButtons");
const $clockEditButton = document.querySelector(
  "[data-clock-button='edit']"
).parentElement;

const date = new Date();

const rotateEffect = (el, deg) =>
  el.style.setProperty("transform", `rotate(${deg}deg)`);

const setBorderEffect = () => {
  const time = date.toLocaleTimeString();
  const seconds = time.match(/:\d{1,2}$/)[0].replace(":", "");
  const deg = 6 * seconds;

  rotateEffect($clockBackground, deg);
};

const fillClockInfo = () => {
  const daystring = daysOfWeek[date.getDay()].slice(0, 3);
  const dayNumber = date.getDate();
  const month = months[date.getMonth()].slice(0, 3);

  fetch("https://ipapi.co/country_name")
    .then((res) => {
      if (res.status === 429) throw res.json();
      return res.text();
    })
    .then((data) => ($clockLocation.textContent = `Standar time of ${data}`))
    .catch((err) => {
      console.log(err);
      $clockLocation.textContent = "Standar time of your device.";
    });

  $clockLocalDate.textContent = `${daystring}., ${dayNumber} ${month}.`;
};

const chargeSecondaryClocks = () => {
  const $secondaryClocks = document.querySelectorAll(".secondary-clock");
  if ($secondaryClocks.length !== 0)
    $secondaryClocks.forEach((clock) => clock.remove());

  if (secondaryClocksState.length === 0)
    return $clockEditButton.classList.add("display-none");

  if ($clockEditButton.classList.contains("display-none"))
    $clockEditButton.classList.remove("display-none");

  const orderOfClocks = secondaryClocksState.reduce(
    (listSorted, { timeZone, order }) => {
      const { local, strTimeDescription } = getInfoFromTimeZone(timeZone);

      listSorted[order] = CaBtnGroup({
        className: `secondary-clock`,
        name: local,
        dataset: { name: "clockTimeZone", value: timeZone },
        child: CaSecondaryClockChild({ strTimeDescription }),
      });

      return listSorted;
    },
    []
  );

  orderOfClocks.forEach((el) =>
    $clockButtons.insertAdjacentElement("afterbegin", el)
  );
};

const initClockInterface = () => {
  setBorderEffect();
  fillClockInfo();
  chargeSecondaryClocks();
};

export { initClockInterface, chargeSecondaryClocks };
