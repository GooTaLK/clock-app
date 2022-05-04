import { getLocalData } from "../helpers/JSONAndLocalStorage";

import CaAlarmCard from "../dom_elements/CaAlarmCard";
import AlarmEmptyContent from "../dom_elements/CaAlarmEmptyContent";

const $alarmContent = document.querySelector(".alarm-content");
const $alarmButtons = document.getElementById("alarmButtons");

const emptyAlarmContent = () => {
  const [$frontage, $button] = AlarmEmptyContent();

  $alarmContent.append($frontage, $button);
  $alarmContent.classList.add("alarm-content--empty");
  $alarmButtons.classList.add("display-none");
  $alarmButtons.style.width = 0;
};

const initAlarmInterface = () => {
  const alarmData = getLocalData("alarm-data");

  $alarmContent.innerHTML = "";

  if (!alarmData || alarmData.length === 0) {
    emptyAlarmContent();
    return;
  }

  alarmData
    .reverse()
    .forEach(({ time, repeat, customRepeat, name, active, id }) => {
      $alarmContent.appendChild(
        CaAlarmCard({ time, name, repeat, customRepeat, active, id })
      );
    });
  $alarmContent.classList.remove("alarm-content--empty");
  $alarmButtons.classList.remove("display-none");
  $alarmButtons.removeAttribute('style');
};

export { initAlarmInterface };
