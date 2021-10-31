import defaultAlarmModalAddSet from "../../data/alarm_default_data/modal_add_set.json";
import defaultAlarmModalSettingsSet from "../../data/alarm_default_data/modal_settings_set.json";
import defaultAlarmSecondModalEditRepeat from "../../data/alarm_default_data/second_modal_edit_repeat.json";
import defaultAlarmSecondModalCustomRepeat from "../../data/alarm_default_data/second_modal_custom_repeat.json";
import defaultAlarmSecondModalEditRing from "../../data/alarm_default_data/second_modal_edit_ring.json";
import defaultAlarmSecondModalSetRingDuration from "../../data/alarm_default_data/second_modal_set_ring_duration.json";
import defaultAlarmSecondModalSetRepeatSettings from "../../data/alarm_default_data/second_modal_set_repeat_settings.json";
import defaultRepeatAllowValues from "../../data/alarm_default_data/repeat_allow_values.json";

import useOn from "../helpers/use_on";
import {
  addLocalData,
  deleteLocalData,
  getLocalData,
  getOneLocalDataById,
  updateLocalData,
  updateAllLocalData,
} from "../helpers/JSONAndLocalStorage";
import { getTimeFromDate } from "../helpers/date_formater";
import getDataOfParent from "../helpers/getDataOfParent";
import { capitalize } from "../helpers/capitalize";

import Modal from "../dom_elements/modal/modal";
import CaAlarmEditModal from "../dom_elements/alarmModal/CaAlarmEditModal";
import initWheelInEditModal, { wheels } from "./wheels_in_alarm_edit_time";
import { initAlarmInterface } from "./alarm_interface";
import CaAlarmSettingModal from "../dom_elements/alarmModal/CaAlarmSettingModal";
import CaSecondModal from "../dom_elements/modal/CaSecondModal";

const $toolContainer = document.querySelector(".tools-container");
const modal = new Modal(".main");
const secondModal = new Modal(".main");

const initDefaultData = (key, defaultData) => {
  const data = getLocalData(key);
  !data && addLocalData(key, defaultData);
};

const moveToolContainerX = (value) =>
  $toolContainer.style.setProperty("transform", `translateX(${value})`);

const insertValuesInDefault = (defaultData, values, newProp) => {
  const newData = defaultData.map((obj) => {
    const newObj = values.includes(obj.value) ? { ...obj, ...newProp } : obj;
    return newObj;
  });

  return newData;
};

const setValueFromOption = ({ target, buttonSelector, valueTag }) => {
  const $icon = target.querySelector(".ca-i-turn_circle");
  const isActive = $icon.classList.contains("ca-i-turn_circle--active");

  if (isActive) return isActive;

  const $activeIcon = target.parentElement.querySelector(
    ".ca-i-turn_circle--active"
  );
  const $button = document.querySelector(buttonSelector);
  const $innerText = $button.querySelector(valueTag);
  const value = target.value;

  $activeIcon.classList.remove("ca-i-turn_circle--active");
  $icon.classList.add("ca-i-turn_circle--active");
  $button.value = value;
  $innerText.textContent = value;

  return isActive;
};

const initAlarmEditModal = () => {
  const customValuesForRepeat = [];

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

  const updateDataIfIsAdd = (data) => {
    const $addModal = document.querySelector(".alarm-modal");
    const isAdd = $addModal.dataset.alarmModalType === "add";
    if (!isAdd) return;

    updateAllLocalData("alarm-add-set", data);
  };

  initWheelInEditModal("left");
  initWheelInEditModal("right");
  initDefaultData("alarm-add-set", defaultAlarmModalAddSet);

  useOn({
    typeEvent: "click",
    selector: ".alarm-content__card[data-alarm-button='edit']",
    callback: ({ target }) => {
      if (target.matches(".ca-i-switch")) return;

      const alarmId = getDataOfParent(target, "alarmId");
      const { time, name, repeat, ring, vibrate } = getOneLocalDataById(
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
          repeat,
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

      const editOptions = getLocalData("alarm-add-set")[0];

      modal.open({
        children: CaAlarmEditModal({
          ...editOptions,
          isEdit: false,
          id: null,
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

      const repeatAllowValues = defaultRepeatAllowValues;
      const repeatValue = repeat.value;
      const isRepeatCustom = !repeatAllowValues.includes(repeatValue);

      const generateId = `_id-r:${Math.round(
        Math.random() * 100
      )}-t:${Date.now()}`;

      const newAlarmToSave = {
        ring: ring.value,
        vibrate: vibrate.value,
        repeat: repeat.value,
        customRepeat: isRepeatCustom,
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
    callback: ({ target }) => {
      const allowValues = defaultRepeatAllowValues;
      const value = target.value;
      const isCustom = !allowValues.includes(value);

      let repeatOptions;

      if (isCustom) {
        repeatOptions = defaultAlarmSecondModalEditRepeat.map((option) =>
          option.value === "custom"
            ? { ...option, value, active: true }
            : option
        );
      } else {
        repeatOptions = insertValuesInDefault(
          defaultAlarmSecondModalEditRepeat,
          [value],
          { active: true }
        );
      }

      secondModal.open({
        children: CaSecondModal({
          title: "Repetir",
          content: {
            type: "options",
            options: repeatOptions,
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
    selector: "[data-sm-option='alarm set repeat']",
    callback: ({ target }) => {
      const isActive = setValueFromOption({
        target,
        buttonSelector: ".alarm-option__edit-repeat button",
        valueTag: "span",
      });

      !isActive && updateDataIfIsAdd({ repeat: target.value });

      secondModal.close({});
    },
  });

  useOn({
    typeEvent: "click",
    selector: "[data-sm-option='alarm set custom repeat button']",
    callback: ({ target }) => {
      const value = target.value;
      const arrayOfValues = value.split(";");
      const customRepeatOptions = insertValuesInDefault(
        defaultAlarmSecondModalCustomRepeat,
        arrayOfValues,
        { active: true }
      );

      arrayOfValues.forEach((value) => customValuesForRepeat.push(value));

      secondModal.toggle();
      secondModal.open({
        children: CaSecondModal({
          title: "Customize repeat",
          content: {
            type: "options",
            options: customRepeatOptions,
          },
          buttons: [
            {
              text: "Cancel",
              dataset: "close",
              className: "alarm-set__custom-repeat__cancel",
            },
            {
              text: "Accept",
              className: "alarm-set__custom-repeat__accept",
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
    callback: ({ target }) => {
      const $icon = target.querySelector(".ca-i-check_circle");
      const isActive = $icon.classList.contains("ca-i-check_circle--active");

      if (isActive) {
        const indexOfValue = customValuesForRepeat.indexOf(target.value);
        customValuesForRepeat.splice(indexOfValue, 1);
        $icon.classList.toggle("ca-i-check_circle--active");
      } else {
        customValuesForRepeat.push(target.value);
        $icon.classList.toggle("ca-i-check_circle--active");
      }
    },
  });

  useOn({
    typeEvent: "click",
    selector: ".alarm-set__custom-repeat__calcel",
    callback: () => customValuesForRepeat.splice(0),
  });

  useOn({
    typeEvent: "click",
    selector: ".alarm-set__custom-repeat__accept",
    callback: () => {
      const $buttons = document.querySelectorAll(
        "[data-sm-option='alarm set custom repeat']"
      );
      const values = [];

      const setValues = () => {
        const $repeatButton = document.querySelector(
          ".alarm-option__edit-repeat button"
        );
        const $innerText = $repeatButton.querySelector("span");

        const value = values.join(";");
        const capitalizeValues = values.map((value) => capitalize(value));

        $innerText.textContent = capitalizeValues.join(", ") + ".";
        $repeatButton.value = value;
        updateDataIfIsAdd({ repeat: value });
      };

      [...$buttons].forEach((button) => {
        const $icon = button.querySelector(".ca-i-check_circle");
        const isActive = $icon.classList.contains("ca-i-check_circle--active");

        isActive && values.push(button.value);
      });

      setValues();
      customValuesForRepeat.splice(0);
      secondModal.close({});
    },
  });

  useOn({
    typeEvent: "click",
    selector: ".alarm-option__edit-ring button",
    callback: ({ target }) => {
      const value = target.value;
      const ringOptions = insertValuesInDefault(
        defaultAlarmSecondModalEditRing,
        [value],
        { active: true }
      );

      secondModal.open({
        children: CaSecondModal({
          title: "Ring",
          content: {
            type: "options",
            options: ringOptions,
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
    selector: "[data-sm-option='alarm set ring']",
    callback: ({ target }) => {
      const isActive = setValueFromOption({
        target,
        buttonSelector: ".alarm-option__edit-ring button",
        valueTag: "span",
      });

      !isActive && updateDataIfIsAdd({ ring: target.value });

      secondModal.close({});
    },
  });

  useOn({
    typeEvent: "click",
    selector: ".alarm-option__edit-vibrate button",
    callback: ({ target }) => {
      const $switch = target.querySelector(".ca-i-switch");
      const isOn = target.value === "On";
      const newValue = isOn ? "Off" : "On";

      $switch.classList.toggle("ca-i-switch--active");
      target.value = newValue;
      updateDataIfIsAdd({ vibrate: newValue });
    },
  });

  useOn({
    typeEvent: "click",
    selector: ".alarm-option__edit-name button",
    callback: ({ target }) => {
      const value = target.value;

      secondModal.open({
        children: CaSecondModal({
          title: "Name",
          content: {
            type: "input",
            input: { value, className: "alarm-input-name" },
          },
          buttons: [
            { text: "Cancel", dataset: "close" },
            { text: "Accept", className: "alarm-set-input-name" },
          ],
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
    selector: ".alarm-set-input-name",
    callback: () => {
      const $nameButton = document.querySelector(
        ".alarm-option__edit-name button"
      );
      const $innerText = $nameButton.querySelector("span");
      const $input = document.querySelector(".alarm-input-name");
      const value = $input.value;

      $nameButton.value = value;
      $innerText.textContent = value;
      updateDataIfIsAdd({ name: value });
      secondModal.close({});
    },
  });

  useOn({
    typeEvent: "keyup",
    selector: ".alarm-input-name",
    callback: (e) => {
      const acceptButton = document.querySelector(".alarm-set-input-name");
      const pressEnter = e.key === "Enter";
      pressEnter && acceptButton.click();
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
  initDefaultData("alarm-settings-set", defaultAlarmModalSettingsSet);

  useOn({
    typeEvent: "click",
    selector: "button[data-alarm-button='settings']",
    callback: () => {
      const settingsSet = getLocalData("alarm-settings-set")[0];

      modal.open({
        children: CaAlarmSettingModal(settingsSet),
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
    callback: ({ target }) => {
      const value = Number(target.value);
      const ringSetOptions = insertValuesInDefault(
        defaultAlarmSecondModalSetRingDuration,
        [value],
        { active: true }
      );

      secondModal.open({
        children: CaSecondModal({
          title: "Ring duration",
          content: {
            type: "options",
            options: ringSetOptions,
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
    selector: "[data-sm-option='alarm set ring duration']",
    callback: ({ target }) => {
      const isActive = setValueFromOption({
        target,
        buttonSelector: ".alarm-option__set-ring-duration button",
        valueTag: "i",
      });

      !isActive &&
        updateAllLocalData("alarm-settings-set", {
          ringDuration: Number(target.value),
        });

      secondModal.close({});
    },
  });

  useOn({
    typeEvent: "click",
    selector: ".alarm-option__set-repeat-setting button",
    callback: ({ target }) => {
      const values = target.value.split(";");
      const repeatSetRanges = defaultAlarmSecondModalSetRepeatSettings.map(
        (obj, index) => {
          return { ...obj, value: values[index] };
        }
      );

      secondModal.open({
        children: CaSecondModal({
          title: "Repeat settings",
          content: {
            type: "ranges",
            ranges: repeatSetRanges,
          },
          buttons: [
            { text: "Cancel", dataset: "close" },
            { text: "Accept", className: "alarm-set__repeat-setting__accept" },
          ],
        }),
        animation: "opacity1",
        next: () => {
          const $ranges = document.querySelectorAll(
            ".second-modal__frame-content .ca-range_input"
          );
          const rangeDataNames = ["alarm intervals", "ring times"];
          const rangeIntervals = {
            "alarm intervals": ["5", "10", "15", "20", "25", "30"],
            "ring times": ["1", "3", "5", "10"],
          };

          $ranges.forEach((range) => {
            const rangeName = range.parentElement.dataset.smRangeName;
            if (!rangeDataNames.includes(rangeName)) return;

            const intervals = rangeIntervals[rangeName];
            const part = intervals.indexOf(String(range.value));
            const total = intervals.length - 1;
            const percentage = (part / total) * 100;
            const x = (percentage / 100) * range.clientWidth;

            range.style.setProperty("--v", `${percentage}%`);
            range.style.setProperty("--x", `${x}px`);
          });
        },
      });
    },
  });

  useOn({
    typeEvent: "click",
    selector: ".alarm-set__repeat-setting__accept",
    callback: () => {
      const $intervalRangeValue = document.querySelector(
        "[data-sm-range-name='alarm intervals'] button"
      ).value;
      const $timesRangeValue = document.querySelector(
        "[data-sm-range-name='ring times'] button"
      ).value;
      const $repeatSettingButton = document.querySelector(
        ".alarm-option__set-repeat-setting button"
      );
      const $i = $repeatSettingButton.querySelectorAll("i");

      $repeatSettingButton.value = `${$intervalRangeValue};${$timesRangeValue}`;
      $i[0].textContent = $intervalRangeValue;
      $i[1].textContent = $timesRangeValue;

      updateAllLocalData("alarm-settings-set", {
        repeatInterval: Number($intervalRangeValue),
        repeatTimes: Number($timesRangeValue),
      });
      secondModal.close({});
    },
  });
};

const initAlarmSecondModal = () => {
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

        $rangeRingTimes.value = outValues[String(inValue)];
        $rangeRingTimes.style.setProperty("--v", `${inValue}%`);
        $rangeRingTimes.style.setProperty("--x", `${x}px`);
      }
    },
  });
};

modal.insert();
secondModal.insert();

export { initAlarmEditModal, initAlarmSettingsModal, initAlarmSecondModal };
