import defaultSettingsModalSet from "../../../data/alarm/default_settings_modal_set.json";

import CaModalHeader from "../modal/CaModalHeader";
import CaModalOption from "../modal/CaModalOption";

const CaAlarmSettingModal = ({
  ringDuration = defaultSettingsModalSet.ringDuration,
  repeatInterval = defaultSettingsModalSet.repeatInterval,
  repeatTimes = defaultSettingsModalSet.repeatTimes,
}) => {
  const $container = document.createElement(".div");
  const $content = document.createElement(".div");
  const $header = CaModalHeader({
    headerClass: "alarm-modal__settings",
    title: "Settings",
  });
  const $settingDuration = CaModalOption("alarm-option__set-ring-duration", {
    type: "button",
    text: "Ring duration",
    description: `Alarms will stop in <i>${ringDuration}</i> minutes`,
  });
  const $repeatSetting = CaModalOption("alarm-option__set-repeat-setting", {
    type: "button",
    text: "Repeat setting",
    description: `Alarm interval of ${repeatInterval} min; automaticly silence after ${repeatTimes} times`,
  });

  $content.append($settingDuration, $repeatSetting);
  $container.append($header, $content);

  return $container;
};

export default CaAlarmSettingModal;
