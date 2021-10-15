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

const $toolContainer = document.querySelector(".tools-container");
const modal = new Modal(".main");

const initAlarmEditModal = () => {
  let removeListenersWhenClose;

  const closeAlarmModal = (isEdit) => {
    modal.close({
      callback: () =>
        isEdit
          ? $toolContainer.style.setProperty("transform", "translateX(0vw)")
          : null,
    });
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
        callback: () =>
          $toolContainer.style.setProperty("transform", "translateX(-100vw)"),
      });

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
        callback: () =>
          $toolContainer.style.setProperty("transform", "translateX(-100vw)"),
      });
    },
  });

  useOn({
    typeEvent: "click",
    selector: "[data-alarm-button='close-modal']",
    callback: ({ target }) => {
      const modalType = getDataOfParent(target, "alarmModalType");
      if (modalType !== "settings") return;

      modal.close({
        callback: () =>
          $toolContainer.style.setProperty("transform", "translateX(0vw)"),
      });
    },
  });
};

modal.insert();

export { initAlarmEditModal, initAlarmSettingsModal };
