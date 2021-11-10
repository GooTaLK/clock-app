import { addLocalData, getLocalData } from "../helpers/JSONAndLocalStorage";

import Modal from "../dom_elements/modal/modal";
import CaSecondModal from "../dom_elements/modal/CaSecondModal";
import initAlarmEditModal from "./alarm_edit_modal";
import initAlarmSettingsModal from "./alarm_settings_modal";
import initSecondModal from "./second_modal";

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

const initModals = () => {
  initAlarmEditModal({
    modal,
    secondModal,
    CaSecondModal,
    initDefaultData,
    setValueFromOption,
    insertValuesInDefault,
    moveToolContainerX,
  });
  initAlarmSettingsModal({
    modal,
    secondModal,
    CaSecondModal,
    initDefaultData,
    setValueFromOption,
    insertValuesInDefault,
    moveToolContainerX,
  });
  initSecondModal({ secondModal });
};

modal.insert();
secondModal.insert();

export { modal, secondModal };

export default initModals;
