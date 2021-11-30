import defaultAlarmModalAddSet from "../../data/alarm_default_data/modal_add_set.json";
import defaultRepeatAllowValues from "../../data/alarm_default_data/repeat_allow_values.json";
import defaultAlarmSecondModalEditRepeat from "../../data/alarm_default_data/second_modal_edit_repeat.json";
import defaultAlarmSecondModalCustomRepeat from "../../data/alarm_default_data/second_modal_custom_repeat.json";
import defaultAlarmSecondModalEditRing from "../../data/alarm_default_data/second_modal_edit_ring.json";

import useOn from "../helpers/use_on";
import { getTimeFromDate } from "../helpers/date_formater";
import {
  getLocalData,
  getOneLocalDataById,
  updateLocalData,
  updateAllLocalData,
  addLocalData,
  deleteLocalData,
} from "../helpers/JSONAndLocalStorage";
import getDataOfParent from "../helpers/getDataOfParent";
import { capitalize } from "../helpers/capitalize";

import CaAlarmEditModal from "../dom_elements/alarmModal/CaAlarmEditModal";
import initWheel, { wheels } from "./wheels_in_alarm_edit_time";
import { initAlarmInterface } from "./alarm_interface";
import { alarmState, updateAllAlarmState } from "./alarm";

const initAlarmEditModal = ({
  modal,
  secondModal,
  CaSecondModal,
  initDefaultData,
  changeOption,
  modifyOptionSet,
  toggleSwitchOption,
  moveToolContainerX,
}) => {
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

  initWheel("left");
  initWheel("right");
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

      if (isEdit) {
        const newAlarmState = alarmState.map((alarm) =>
          alarm.id === id ? newAlarmToSave : alarm
        );

        updateLocalData("alarm-data", newAlarmToSave, { id });
        updateAllAlarmState(newAlarmState);
      } else {
        addLocalData("alarm-data", newAlarmToSave);
        alarmState.push(newAlarmToSave);
      }

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
        repeatOptions = modifyOptionSet(
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
      const isActive = changeOption({
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
      const customRepeatOptions = modifyOptionSet(
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
      if (customValuesForRepeat.length === 0) return;

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
      const ringOptions = modifyOptionSet(
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
      const isActive = changeOption({
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
      const newValue = toggleSwitchOption(target);
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
      const newAlarmState = alarmState.filter((alarm) => alarm.id !== alarmId);

      deleteLocalData("alarm-data", { id: alarmId });
      updateAllAlarmState(newAlarmState);
      closeAlarmModal(isEdit);
      initAlarmInterface();
    },
  });
};

export default initAlarmEditModal;
