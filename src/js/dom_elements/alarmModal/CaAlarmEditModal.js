import CaModalHeader from "../modal/CaModalHeader";
import CaModalOption from "../modal/CaModalOption";
import CaAlarmModalEditTime from "./CaAlarmModalEditTime";

const CaAlarmEditModal = ({
  isEdit = true,
  id = null,
  time = {
    rotateOfLeft: 0,
    rotateOfRight: 0,
  },
  repeat = "Only one time",
  ring = "Creamy",
  vibrate = "off",
  name = "Alarm",
}) => {
  const $container = document.createElement("div");
  const $content = document.createElement("form");
  const $header = CaModalHeader({
    headerClass: "alarm-modal__header",
    title: isEdit ? "Edit alarm" : "Add alarm",
    close: true,
    check: true,
  });
  const $editTime = CaModalOption("alarm-option__edit-time", {
    type: "children",
    children: CaAlarmModalEditTime(time.rotateOfLeft, time.rotateOfRight),
  });
  const $editRepeat = CaModalOption({
    optionClass: "alarm-option__edit-repeat",
    child: {
      type: "selectButton",
      name: "repeat",
      text: "Repeat",
      value: repeat,
      chevronText: repeat,
    },
  });
  const $editRing = CaModalOption("alarm-option__edit-ring", {
    type: "selectButton",
    name: "ring",
    text: "Ring",
    value: ring,
    chevronText: ring,
  });
  const $editVibrate = CaModalOption("alarm-option__edit-vibrate", {
    type: "switchButton",
    name: "vibrate",
    text: "Vibrate",
    value: vibrate,
  });
  const $editName = CaModalOption("alarm-option__edit-name", {
    type: "selectButton",
    name: "alarmName",
    text: "Name",
    value: name,
    chevronText: name,
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
