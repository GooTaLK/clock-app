import useOn from "../helpers/use_on";
import { getLocalData, updateLocalData } from "../helpers/JSONAndLocalStorage";

import CaAlarmCard from "../dom_elements/CaAlarmCard";
import AlarmEmptyContent from "../dom_elements/CaAlarmEmptyContent";

const $alarmContent = document.querySelector(".alarm-content");
const $alarmButtons = document.getElementById("alarmButtons");

const emptyAlarmContent = () => {
  const [$frontage, $button] = AlarmEmptyContent();

  $alarmContent.append($frontage, $button);
  $alarmContent.classList.add("alarm-content--empty");
  $alarmButtons.classList.add("display-none");
};

const initAlarmInterface = () => {
  const alarmData = getLocalData("alarm-data");

  $alarmContent.innerHTML = "";

  if (!alarmData) {
    emptyAlarmContent();
    return;
  }

  alarmData.reverse().forEach(({ time, repeatAt, name, active, id }) => {
    $alarmContent.appendChild(
      CaAlarmCard({ time, name, repeatAt, active, id })
    );
  });
  $alarmContent.classList.remove("alarm-content--empty");
  $alarmButtons.classList.remove("display-none");
};

const initAlarmListeners = () => {
  useOn({
    typeEvent: "click",
    selector: ".alarm-content__card .ca-i-switch",
    callback: ({ target }) => {
      const isActive = target.classList.contains("ca-i-switch--active");
      const alarmId = target.parentElement.dataset.alarmId;

      target.classList.toggle("ca-i-switch--active");
      target.parentElement.classList.toggle("alarm-content__card--active");
      updateLocalData("alarm-data", { active: !isActive }, { id: alarmId });
    },
  });
};

export { initAlarmInterface, initAlarmListeners };
