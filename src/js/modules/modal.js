import defaultAlarmModalAddSet from "../../data/alarm_default_data/modal_add_set.json";
import defaultAlarmModalSettingsSet from "../../data/alarm_default_data/modal_settings_set.json";
import defaultAlarmSecondModalEditRepeat from "../../data/alarm_default_data/second_modal_edit_repeat.json";
import defaultAlarmSecondModalCustomRepeat from "../../data/alarm_default_data/second_modal_custom_repeat.json";
import defaultAlarmSecondModalEditRing from "../../data/alarm_default_data/second_modal_edit_ring.json";
import defaultAlarmSecondModalSetRingDuration from "../../data/alarm_default_data/second_modal_set_ring_duration.json";
import defaultAlarmSecondModalSetRepeatSettings from "../../data/alarm_default_data/second_modal_set_repeat_settings.json";

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
          ...defaultAlarmModalAddSet,
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
            options: defaultAlarmSecondModalEditRepeat,
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
            options: defaultAlarmSecondModalCustomRepeat,
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
            options: defaultAlarmSecondModalEditRing,
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
        children: CaAlarmSettingModal(defaultAlarmModalSettingsSet),
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
            options: defaultAlarmSecondModalSetRingDuration,
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
            ranges: defaultAlarmSecondModalSetRepeatSettings,
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
      const changeClassToActive = (isActive) => {
        if (isActive) return;

        const $optionActivated = document.querySelector(
          "[data-sm-option='alarm set ring duration'] .ca-i-turn_circle--active"
        );
        $optionActivated.classList.remove("ca-i-turn_circle--active");
        $optionTargeted.classList.add("ca-i-turn_circle--active");
      };

      changeClassToActive(isActive);
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
