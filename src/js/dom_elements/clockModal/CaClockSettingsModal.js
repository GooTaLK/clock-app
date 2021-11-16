import { clockState } from "../../modules/clock";
import CaModalHeader from "../modal/CaModalHeader";
import CaModalOption from "../modal/CaModalOption";

const CaClockSettingsModal = () => {
  const $container = document.createElement("div");
  const $content = document.createElement("div");
  const $header = CaModalHeader({
    headerClass: "clock-modal__settings",
    title: "Settings",
    close: { exist: true, dataName: "clockButton", dataValue: "close-modal" },
  });
  const $formatOption = CaModalOption("clock-option__set-format", {
    type: "switchButton",
    text: "Format 24h",
    value: clockState.formatType === "24h" ? "on" : "off",
  });

  $container.classList.add("clock-modal");
  $container.dataset.clockModalType = "settings";

  $content.classList.add("clock-modal__content");

  $content.appendChild($formatOption);
  $container.append($header, $content);

  return $container;
};

export default CaClockSettingsModal;
