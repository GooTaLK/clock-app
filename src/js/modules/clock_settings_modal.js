import useOn from "../helpers/use_on";

import CaClockSettingsModal from "../dom_elements/clockModal/CaClockSettingsModal";

const initClockSettingsModal = ({ modal, moveToolContainerX }) => {
  useOn({
    typeEvent: "click",
    selector: "button[data-clock-button='settings']",
    callback: () => {
      modal.open({
        children: CaClockSettingsModal(),
        animation: "rightToLeft",
        next: () => moveToolContainerX("-200vw"),
      });
    },
  });

  useOn({
    typeEvent: "click",
    selector: "[data-clock-button='close-modal']",
    callback: () => {
      modal.close({});
      moveToolContainerX("-100vw");
    },
  });

  useOn({
    typeEvent: "click",
    selector: ".clock-option__set-format button",
    callback: () => {
      // definir cambios en el estado: usar localstorage o un estado local
    },
  });
};

export default initClockSettingsModal;
