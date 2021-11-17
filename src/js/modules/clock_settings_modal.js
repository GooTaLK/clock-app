import useOn from "../helpers/use_on";

import CaClockSettingsModal from "../dom_elements/clockModal/CaClockSettingsModal";
import { toggleClockFormat } from "./clock";

const initClockSettingsModal = ({
  modal,
  toggleSwitchOption,
  moveToolContainerX,
}) => {
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
    callback: ({ target }) => {
      toggleSwitchOption(target);
      toggleClockFormat();
    },
  });
};

export default initClockSettingsModal;
