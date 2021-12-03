import { capitalize } from "../../helpers/capitalize";

import CaModalHeader from "../modal/CaModalHeader";
import CaModalOption from "../modal/CaModalOption";
import CaAlarmModalEditTime from "./CaAlarmModalEditTime";

const CaAlarmEditModal = ({
  isEdit,
  id,
  time,
  repeat,
  ring,
  vibrate,
  name,
}) => {
  const $container = document.createElement("div");
  const $content = document.createElement("form");
  const repeatText = repeat
    .split(";")
    .map((value) => capitalize(value))
    .join(", ");

  const $header = CaModalHeader({
    headerClass: "alarm-modal__header",
    title: isEdit ? "Edit alarm" : "Add alarm",
    close: { exist: true, dataName: "alarmButton", dataValue: "close-modal" },
    check: { exist: true, dataName: "alarmButton", dataValue: "save" },
  });
  const $editTime = CaModalOption("alarm-option__edit-time", {
    type: "children",
    children: CaAlarmModalEditTime(time.rotateOfLeft, time.rotateOfRight),
  });
  const $editRepeat = CaModalOption("alarm-option__edit-repeat", {
    type: "button",
    button: {
      name: "repeat",
      text: "Repeat",
      value: repeat,
      rightIcon: { className: "ca-i-chevron", text: repeatText },
    },
  });
  const $editRing = CaModalOption("alarm-option__edit-ring", {
    type: "button",
    button: {
      name: "ring",
      text: "Ring",
      value: ring,
      rightIcon: { className: "ca-i-chevron", text: ring },
    },
  });
  const $editVibrate = CaModalOption("alarm-option__edit-vibrate", {
    type: "switchButton",
    switchButton: {
      name: "vibrate",
      text: "Vibrate",
      value: vibrate,
    },
  });
  const $editName = CaModalOption("alarm-option__edit-name", {
    type: "button",
    button: {
      name: "alarmName",
      text: "Name",
      value: name,
      rightIcon: { className: "ca-i-chevron", text: name },
    },
  });

  $container.classList.add("alarm-modal");
  $container.dataset.alarmModalType = isEdit ? "edit" : "add";
  id && ($container.dataset.alarmId = id);

  $content.classList.add("alarm-modal__content");

  $content.append($editTime, $editRepeat, $editRing, $editVibrate, $editName);

  if (isEdit) {
    const $deleteBtn = document.createElement("button");

    $deleteBtn.classList.add("ca-long-btn");
    $deleteBtn.name = "delete";
    $deleteBtn.dataset.alarmButton = "delete";
    $deleteBtn.textContent = "Delete alarm";

    const $editDelete = CaModalOption("alarm-option__edit-delete", {
      type: "children",
      children: $deleteBtn,
    });

    $content.appendChild($editDelete);
  }

  $container.append($header, $content);

  return $container;
};

export default CaAlarmEditModal;
