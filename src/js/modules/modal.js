import useOn from "../helpers/use_on";
import {
  addLocalData,
  deleteLocalData,
  getOneLocalDataById,
  updateLocalData,
} from "../helpers/JSONAndLocalStorage";
import { getTimeFromDate } from "../helpers/date_formater";
import getDataOfParent from "../helpers/getDataOfParent";

import Modal from "../dom_elements/modal/modal";
import CaAlarmEditModal from "../dom_elements/alarmModal/CaAlarmEditModal";
import initWheelInEditModal, { wheels } from "./wheels_in_alarm_edit_time";
import { initAlarmInterface } from "./alarm_interface";
import CaAlarmSettingModal from "../dom_elements/alarmModal/CaAlarmSettingModal";
import CaSecondModal from "../dom_elements/modal/CaSecondModal";

const $toolContainer = document.querySelector(".tools-container");
const modal = new Modal(".main");
const secondModal = new Modal(".main");

const moveToolContainerX = (value) =>
  $toolContainer.style.setProperty("transform", `translateX(${value})`);

const initAlarmEditModal = () => {
  let removeListenersWhenClose;

  const closeAlarmModal = (isEdit) => {
    isEdit && moveToolContainerX("0vw");
    modal.close({});
    removeListenersWhenClose();
  };

  const addListenersWhenCreate = () => {
    const [addSubmitAlarmForm, removeSubmitAlarmForm] = useOn({
      mode: "selector",
      typeEvent: "submit",
      selector: ".alarm-modal__content",
      callback: (e) => e.preventDefault(),
    });
    const [addLeftMouseLeave, removeLeftMouseLeave] =
      wheels.left.mouseLeaveListener();
    const [addRightMouseLeave, removeRightMouseLeave] =
      wheels.right.mouseLeaveListener();

    addSubmitAlarmForm();
    addLeftMouseLeave();
    addRightMouseLeave();

    removeListenersWhenClose = () => {
      removeSubmitAlarmForm();
      removeLeftMouseLeave();
      removeRightMouseLeave();
    };
  };

  initWheelInEditModal("left");
  initWheelInEditModal("right");

  useOn({
    typeEvent: "click",
    selector: ".alarm-content__card[data-alarm-button='edit']",
    callback: ({ target }) => {
      if (target.matches(".ca-i-switch")) return;

      const alarmId = getDataOfParent(target, "alarmId");
      const { time, name, repeatAt, ring, vibrate } = getOneLocalDataById(
        "alarm-data",
        alarmId
      );
      const rotateOfLeft = time.split(":")[0] * 15;
      const rotateOfRight = time.split(":")[1] * 6;

      modal.open({
        children: CaAlarmEditModal({
          isEdit: true,
          time: { rotateOfLeft, rotateOfRight },
          id: alarmId,
          name,
          repeat: repeatAt,
          ring,
          vibrate,
        }),
        animation: "rightToLeft",
      });
      moveToolContainerX("-100vw");

      wheels.left.rotateValue = rotateOfLeft;
      wheels.right.rotateValue = rotateOfRight;

      addListenersWhenCreate();
    },
  });

  useOn({
    typeEvent: "click",
    selector: "button[data-alarm-button='add']",
    callback: () => {
      const [hours, minutes] = getTimeFromDate(new Date());
      const rotateOfLeft = hours * 15;
      const rotateOfRight = minutes * 6;

      modal.open({
        children: CaAlarmEditModal({
          isEdit: false,
          time: { rotateOfLeft, rotateOfRight },
        }),
        animation: "botToTop",
      });

      wheels.left.rotateValue = rotateOfLeft;
      wheels.right.rotateValue = rotateOfRight;

      addListenersWhenCreate();
    },
  });

  useOn({
    typeEvent: "click",
    selector: "[data-alarm-button='close-modal']",
    callback: ({ target }) => {
      const modalType = getDataOfParent(target, "alarmModalType");
      if (modalType !== "edit" && modalType !== "add") return;

      const isEdit = modalType === "edit";
      closeAlarmModal(isEdit);
    },
  });

  useOn({
    typeEvent: "click",
    selector: "[data-alarm-button='save']",
    callback: ({ target }) => {
      const isEdit = getDataOfParent(target, "alarmModalType") === "edit";
      const id = getDataOfParent(target, "alarmId");

      const { ring, vibrate, repeat, leftWheel, rightWheel, alarmName } =
        document.querySelector(".alarm-modal__content");

      const generateId = `_id-r-${Math.round(Math.random() * 100)}-t-${
        Date.now
      }`;

      const newAlarmToSave = {
        ring: ring.value,
        vibrate: vibrate.value,
        repeatAt: repeat.value,
        time: `${leftWheel.value}:${rightWheel.value}`,
        name: alarmName.value,
        active: true,
        id: id || generateId,
      };

      isEdit
        ? updateLocalData("alarm-data", newAlarmToSave, { id })
        : addLocalData("alarm-data", newAlarmToSave);

      closeAlarmModal(isEdit);
      initAlarmInterface();
    },
  });

  useOn({
    typeEvent: "click",
    selector: ".alarm-option__edit-repeat button",
    callback: () => {
      secondModal.open({
        children: CaSecondModal({
          title: "Repetir",
          content: {
            type: "options",
            options: [
              {
                text: "Only one time",
                value: "Only one time",
                dataset: "alarm set repeat",
                active: true,
              },
              {
                text: "Monday to Friday",
                value: "Monday to Friday",
                dataset: "alarm set repeat",
              },
              {
                text: "Every day",
                value: "Every day",
                dataset: "alarm set repeat",
              },
              {
                text: "Custom",
                value: "custom",
                dataset: "alarm set custom repeat",
              },
            ],
          },
          buttons: [
            {
              text: "Cancel",
              dataset: "close",
            },
          ],
        }),
        animation: "opacity1",
      });
    },
  });

  useOn({
    typeEvent: "click",
    selector: "[data-sm-option='alarm set custom repeat']",
    callback: () => {
      secondModal.toggle();
      secondModal.open({
        children: CaSecondModal({
          title: "Customize repeat",
          content: {
            type: "options",
            options: [
              {
                text: "Sunday",
                value: "sunday",
                checkIcon: true,
                dataset: "alarm set custom repeat",
              },
              {
                text: "Monday",
                value: "monday",
                checkIcon: true,
                dataset: "alarm set custom repeat",
              },
              {
                text: "Tuesday",
                value: "tuesday",
                checkIcon: true,
                dataset: "alarm set custom repeat",
              },
              {
                text: "Wednesday",
                value: "wednesday",
                checkIcon: true,
                dataset: "alarm set custom repeat",
              },
              {
                text: "Thursday",
                value: "thursday",
                checkIcon: true,
                dataset: "alarm set custom repeat",
              },
              {
                text: "Friday",
                value: "friday",
                checkIcon: true,
                dataset: "alarm set custom repeat",
              },
              {
                text: "Saturday",
                value: "saturday",
                checkIcon: true,
                dataset: "alarm set custom repeat",
              },
            ],
          },
          buttons: [
            {
              text: "Cancel",
              dataset: "close",
            },
            {
              text: "Accept",
            },
          ],
        }),
        animation: "opacity1",
      });
    },
  });

  useOn({
    typeEvent: "click",
    selector: ".alarm-option__edit-ring button",
    callback: () => {
      secondModal.open({
        children: CaSecondModal({
          title: "Ring",
          content: {
            type: "options",
            options: [
              {
                text: "Creamy",
                value: "Creamy",
                dataset: "alarm set ring",
                active: true,
              },
              {
                text: "Pollo a la brasa",
                value: "Pollo a la brasa",
                dataset: "alarm set ring",
              },
              {
                text: "Toc toc",
                value: "Toc toc",
                dataset: "alarm set ring",
              },
            ],
          },
          buttons: [
            {
              text: "Cancel",
              dataset: "close",
            },
          ],
        }),
        animation: "opacity1",
      });
    },
  });

  useOn({
    typeEvent: "click",
    selector: ".alarm-option__edit-vibrate button",
    callback: () => {
      const $switch = document.querySelector(
        ".alarm-option__edit-vibrate button .ca-i-switch"
      );
      const isOn = $switch.parentElement.value === "On";

      $switch.parentElement.value = isOn ? "Off" : "On";
      $switch.classList.toggle("ca-i-switch--active");
    },
  });

  useOn({
    typeEvent: "click",
    selector: ".alarm-option__edit-name button",
    callback: () => {
      secondModal.open({
        children: CaSecondModal({
          title: "Name",
          content: {
            type: "input",
            input: { value: "Alarm" },
          },
          buttons: [{ text: "Cancel", dataset: "close" }, { text: "Accept" }],
        }),
        animation: "opacity1",
        next: () => {
          const $input = document.querySelector(
            "[data-second-modal-type='input'] input"
          );
          $input.select();
        },
      });
    },
  });

  useOn({
    typeEvent: "click",
    selector: "button[data-alarm-button='delete']",
    callback: (e) => {
      e.preventDefault();
      const alarmId = getDataOfParent(e.target, "alarmId");
      const isEdit = getDataOfParent(e.target, "alarmModalType") === "edit";

      deleteLocalData("alarm-data", { id: alarmId });
      closeAlarmModal(isEdit);
      initAlarmInterface();
    },
  });
};

const initAlarmSettingsModal = () => {
  useOn({
    typeEvent: "click",
    selector: "button[data-alarm-button='settings']",
    callback: () => {
      modal.open({
        children: CaAlarmSettingModal({}),
        animation: "rightToLeft",
      });
      moveToolContainerX("-100vw");
    },
  });

  useOn({
    typeEvent: "click",
    selector: "[data-alarm-button='close-modal']",
    callback: ({ target }) => {
      const modalType = getDataOfParent(target, "alarmModalType");
      if (modalType !== "settings") return;

      modal.close({});
      moveToolContainerX("0vw");
    },
  });

  useOn({
    typeEvent: "click",
    selector: ".alarm-option__set-ring-duration button",
    callback: () => {
      secondModal.open({
        children: CaSecondModal({
          title: "Ring duration",
          content: {
            type: "options",
            options: [
              {
                text: "1 minute",
                value: 1,
                dataset: "alarm set ring duration",
              },
              {
                text: "5 minutes",
                value: 5,
                dataset: "alarm set ring duration",
                active: true,
              },
              {
                text: "10 minutes",
                value: 10,
                dataset: "alarm set ring duration",
              },
              {
                text: "15 minutes",
                value: 15,
                dataset: "alarm set ring duration",
              },
              {
                text: "20 minutes",
                value: 20,
                dataset: "alarm set ring duration",
              },
              {
                text: "30 minutes",
                value: 30,
                dataset: "alarm set ring duration",
              },
            ],
          },
          buttons: [
            {
              text: "Cancel",
              dataset: "close",
            },
          ],
        }),
        animation: "opacity1",
      });
    },
  });

  useOn({
    typeEvent: "click",
    selector: ".alarm-option__set-repeat-setting button",
    callback: () => {
      secondModal.open({
        children: CaSecondModal({
          title: "Repeat settings",
          content: {
            type: "ranges",
            ranges: [
              {
                text: "Alarm intervals (minutes)",
                intervals: ["5", "10", "15", "20", "25", "30"],
                dataset: "alarm intervals",
              },
              {
                text: "Ring before silence automaticly (times)",
                intervals: ["1", "3", "5", "10"],
                dataset: "ring times",
              },
            ],
          },
          buttons: [
            { text: "Cancel", dataset: "close" },
            { text: "Accept", className: "alarm-set__repeat-setting__accept" },
          ],
        }),
        animation: "opacity1",
      });
    },
  });

  useOn({
    typeEvent: "click",
    selector:
      ".second-modal__frame-option[data-sm-option='alarm set ring duration']",
    callback: ({ target }) => {
      const $optionTargeted = target.querySelector(".ca-i-turn_circle");
      const isActive = $optionTargeted.classList.contains(
        "ca-i-turn_circle--active"
      );
      const actIfIsNotActive = (isActive) => {
        if (isActive) return;

        const $optionActivated = document.querySelector(
          "[data-sm-option='alarm set ring duration'] .ca-i-turn_circle--active"
        );
        $optionActivated.classList.remove("ca-i-turn_circle--active");
        $optionTargeted.classList.add("ca-i-turn_circle--active");
      };

      actIfIsNotActive(isActive);
      secondModal.close({});
    },
  });
};

const initAlarmSettingsSecondModal = () => {
  useOn({
    typeEvent: "click",
    selector: "[data-sm-btn='close']",
    callback: () => {
      secondModal.close({});
    },
  });

  useOn({
    typeEvent: "mouseup",
    selector: ".second-modal__frame-range",
    callback: ({ target }) => {
      const rangeName = getDataOfParent(target, "smRangeName");
      const $rangeAlarmIntervals = document.querySelector(
        "[data-sm-range-name='alarm intervals'] .ca-range_input"
      );
      const $rangeRingTimes = document.querySelector(
        "[data-sm-range-name='ring times'] .ca-range_input"
      );

      if (rangeName === "alarm intervals") {
        const value = $rangeAlarmIntervals.value;
        const inValue = Math.round(value / 20) * 20;
        const outValues = { 0: 5, 20: 10, 40: 15, 60: 20, 80: 25, 100: 30 };
        const width = $rangeAlarmIntervals.clientWidth;
        const x = (inValue / 100) * width;

        $rangeAlarmIntervals.value = outValues[String(inValue)];
        $rangeAlarmIntervals.style.setProperty("--v", `${inValue}%`);
        $rangeAlarmIntervals.style.setProperty("--x", `${x}px`);
      }
      if (rangeName === "ring times") {
        const value = $rangeRingTimes.value;
        const inValue = Math.trunc(Math.round(value / (100 / 3)) * (100 / 3));
        const outValues = { 0: 1, 33: 3, 66: 5, 100: 10 };
        const width = $rangeRingTimes.clientWidth;
        const x = (inValue / 100) * width;

        console.log(inValue);

        $rangeRingTimes.value = outValues[String(inValue)];
        $rangeRingTimes.style.setProperty("--v", `${inValue}%`);
        $rangeRingTimes.style.setProperty("--x", `${x}px`);
      }
    },
  });
};

modal.insert();
secondModal.insert();

export {
  initAlarmEditModal,
  initAlarmSettingsModal,
  initAlarmSettingsSecondModal,
};

import "./input_range";
