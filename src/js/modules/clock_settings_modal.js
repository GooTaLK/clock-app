import useOn from "../helpers/use_on";
import getDataOfParent from "../helpers/getDataOfParent";

import CaClockSettingsModal from "../dom_elements/clockModal/CaClockSettingsModal";
import { toggleClockFormat } from "./clock";
import { switchClockFormatButton } from "./header_funtionalities";

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
    callback: ({ target }) => {
      const modalType = getDataOfParent(target, "clockModalType");
      if (modalType !== "settings") return;

      modal.close({});
      moveToolContainerX("-100vw");
    },
  });

  useOn({
    typeEvent: "click",
    selector: ".clock-option__set-format button",
    callback: ({ target }) => {
      const format = toggleClockFormat();
      toggleSwitchOption(target);
      switchClockFormatButton(format);
    },
  });
};

export default initClockSettingsModal;
