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

const $toolContainer = document.querySelector(".tools-container");
const modal = new Modal(".main");

const initAlarmEditModal = () => {
  let removeListenersWhenClose;

  const closeAlarmModal = (modal, isEdit) => {
    isEdit && $toolContainer.style.setProperty("transform", "translateX(0vw)");
    modal.toggle();
    setTimeout(() => {
      modal.removeChildren();
      modal.changeAnimation(null);
    }, 200);
    removeListenersWhenClose();
  };

  const handlingEventsWhenCreateEditModal = () => {
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

  useOn({
    typeEvent: "click",
    selector: ".alarm-content__card[data-alarm-button='edit']",
    callback: ({ target }) => {
      if (target.matches(".ca-i-switch")) return;

      const alarmId = getDataOfParent(target, "alarmId");
      const {
        time,
        name,
        repeatAt: repeat,
        ring,
        vibrate,
      } = getOneLocalDataById("alarm-data", alarmId);
      const rotateOfLeft = time.split(":")[0] * 15;
      const rotateOfRight = time.split(":")[1] * 6;

      wheels.left.rotateValue = rotateOfLeft;
      wheels.right.rotateValue = rotateOfRight;
      modal.insertChildren(
        CaAlarmEditModal({
          isEdit: true,
          time: { rotateOfLeft, rotateOfRight },
          id: alarmId,
          name,
          repeat,
          ring,
          vibrate,
        })
      );
      $toolContainer.style.setProperty("transform", "translateX(-100vw)");
      modal.changeAnimation("rightToLeft");
      setTimeout(() => modal.toggle(), 0);

      handlingEventsWhenCreateEditModal();
    },
  });

  useOn({
    typeEvent: "click",
    selector: "button[data-alarm-button='add']",
    callback: () => {
      const [hours, minutes] = getTimeFromDate(new Date());
      const rotateOfLeft = hours * 15;
      const rotateOfRight = minutes * 6;

      wheels.left.rotateValue = rotateOfLeft;
      wheels.right.rotateValue = rotateOfRight;
      modal.insertChildren(
        CaAlarmEditModal({
          isEdit: false,
          time: { rotateOfLeft, rotateOfRight },
        })
      );
      modal.changeAnimation("botToTop");
      setTimeout(() => modal.toggle(), 0);

      handlingEventsWhenCreateEditModal();
    },
  });

  useOn({
    typeEvent: "click",
    selector: "[data-alarm-button='close-modal']",
    callback: ({ target }) => {
      const isEdit = getDataOfParent(target, "alarmModalType") === "edit";
      closeAlarmModal(modal, isEdit);
    },
  });

  useOn({
    typeEvent: "click",
    selector: "[data-alarm-button='save']",
    callback: () => {
      const $alarmModal = document.querySelector(".alarm-modal__content");
      const isEdit =
        $alarmModal.parentElement.dataset.alarmModalType === "edit";
      const id = $alarmModal.parentElement.dataset.alarmId;

      const newAlarmToSave = {
        ring: $alarmModal.ring.value,
        vibrate: $alarmModal.vibrate.value,
        repeatAt: $alarmModal.repeat.value,
        time: `${$alarmModal.leftWheel.value}:${$alarmModal.rightWheel.value}`,
        name: $alarmModal.alarmName.value,
        active: true,
        id:
          id ||
          `_id-r-${Math.round(Math.random() * 100)}-t-${new Date().getTime()}`,
      };

      isEdit
        ? updateLocalData("alarm-data", newAlarmToSave, { id })
        : addLocalData("alarm-data", newAlarmToSave);
      closeAlarmModal(modal, isEdit);
      initAlarmInterface();
    },
  });

  initWheelInEditModal("left");
  initWheelInEditModal("right");

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
      const isEdit = getDataOfParent(e.target, "alarmModalType");

      deleteLocalData("alarm-data", { id: alarmId });
      closeAlarmModal(modal, isEdit);
      initAlarmInterface();
    },
  });
};

modal.insert();

export { initAlarmEditModal };
