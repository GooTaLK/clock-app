import useOn from "../helpers/use_on";
import { getLocalData, updateLocalData } from "../helpers/JSONAndLocalStorage";
import { daysOfWeek } from "../helpers/date_utilities";

import { secondModal } from "./modal";
import CaSecondModal from "../dom_elements/modal/CaSecondModal";
import { initAlarmInterface } from "./alarm_interface";

const alarmState = getLocalData("alarm-data") || [];
const alarmRepeatingState = new Map();

const minutesInMs = 60000;

const updateAllAlarmState = (newAlarmState) => {
  alarmState.splice(0);
  alarmState.push(...newAlarmState);
};

const setTimeToDisableAlert = () => {
  const ringDuration = getLocalData("alarm-settings-set")[0].ringDuration;

  setTimeout(() => {
    secondModal.close({});
  }, ringDuration * minutesInMs);
};

const alertModal = (id, name, time, ring) => {
  secondModal.open({
    children: CaSecondModal({
      title: name.toUpperCase(),
      content: {
        type: "html",
        html: `
          <div class="alarm_audio-content" data-alarm-id="${id}">
            ${time}: ${name}
            <audio
              autoplay
              loop
              src="assets/${ring.toLowerCase().replaceAll(" ", "-")}.mp3"
            >
              Your Browser does not support the <code>audio</code> element.
            </audio>
          </div>
        `,
      },
      buttons: [
        { text: "Ok", dataset: "close", className: "alarm_remove-repeating" },
      ],
    }),
    animation: "opacity1",
  });
  setTimeToDisableAlert();
  initAlarmInterface();
};

const setRepeatAlert = (id, name, time, ring) => {
  const repeatInterval = getLocalData("alarm-settings-set")[0].repeatInterval;
  let repeatTimes = getLocalData("alarm-settings-set")[0].repeatTimes;

  const handleInterval = setInterval(() => {
    if (repeatTimes === 1) {
      clearInterval(handleInterval);
      alarmRepeatingState.delete(id);
    }

    repeatTimes--;
    alertModal(id, name, time, ring);
  }, repeatInterval * minutesInMs);

  alarmRepeatingState.set(id, { handleInterval });
};

const compareTime = (timeString) => {
  const date = new Date();
  const timeSplit = timeString.split(":");
  const time = {
    hours: Number(timeSplit[0]),
    minutes: Number(timeSplit[1]),
    seconds: Number(timeSplit[2]),
  };

  if (
    time.hours === date.getHours() &&
    time.minutes === date.getMinutes() &&
    time.seconds === date.getSeconds()
  )
    return true;
  else return false;
};

const shouldAlert = (id, time, repeat, customRepeat) => {
  if (repeat === "Only one time") {
    if (!compareTime(time)) return false;
    const newAlarmState = alarmState.map((alarm) =>
      alarm.id === id ? { ...alarm, active: false } : alarm
    );

    updateAllAlarmState(newAlarmState);
    updateLocalData("alarm-data", { active: false }, { id });
    return true;
  }
  if (repeat === "Monday to Friday") {
    const date = new Date();

    if (date.getDay() > 0 && date.getDay() < 6 && compareTime(time))
      return true;
    return false;
  }
  if (repeat === "Every day") {
    if (compareTime(time)) return true;
    return false;
  }
  if (customRepeat) {
    const date = new Date();
    const daysInRepeat = repeat.split(";");
    const numbersOfDaysInRepeat = daysInRepeat.map((day) =>
      daysOfWeek.indexOf(day)
    );

    if (numbersOfDaysInRepeat.includes(date.getDay()) && compareTime(time))
      return true;
    return false;
  }
};

const checkAlarms = () => {
  alarmState.forEach(
    ({ id, active, name, time, ring, repeat, customRepeat }) => {
      if (active) {
        const alert = shouldAlert(id, `${time}:00`, repeat, customRepeat);

        if (alert) {
          alertModal(id, name, time, ring);
          setRepeatAlert(id, name, time, ring);
        }
      }
    }
  );
};

const initAlarmListeners = () => {
  useOn({
    typeEvent: "click",
    selector: ".alarm-content__card .ca-i-switch",
    callback: ({ target }) => {
      const isActive = target.classList.contains("ca-i-switch--active");
      const alarmId = target.parentElement.dataset.alarmId;
      const newAlarmState = alarmState.map((alarm) =>
        alarm.id === alarmId ? { ...alarm, active: !isActive } : alarm
      );

      updateLocalData("alarm-data", { active: !isActive }, { id: alarmId });
      updateAllAlarmState(newAlarmState);
      target.classList.toggle("ca-i-switch--active");
      target.parentElement.classList.toggle("alarm-content__card--active");
    },
  });

  useOn({
    typeEvent: "click",
    selector: ".alarm_remove-repeating",
    callback: () => {
      const alarmId = document.querySelector(".alarm_audio-content").dataset
        .alarmId;
      const handleInterval = alarmRepeatingState.get(alarmId).handleInterval;

      handleInterval && clearInterval(handleInterval);
      alarmRepeatingState.delete(alarmId);
    },
  });
};

export { checkAlarms, initAlarmListeners, alarmState, updateAllAlarmState };
