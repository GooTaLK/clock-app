import CaModalHeader from "../modal/CaModalHeader";
import CaModalOption from "../modal/CaModalOption";

const CaAlarmSettingModal = ({ ringDuration, repeatInterval, repeatTimes }) => {
  const $container = document.createElement("div");
  const $content = document.createElement("div");
  const $header = CaModalHeader({
    headerClass: "alarm-modal__settings",
    title: "Settings",
    close: { exist: true, dataName: "alarmButton", dataValue: "close-modal" },
  });
  const $settingDuration = CaModalOption("alarm-option__set-ring-duration", {
    type: "button",
    text: "Ring duration",
    description: `Alarms will stop in <i>${ringDuration}</i> minutes`,
    value: ringDuration,
  });
  const $repeatSetting = CaModalOption("alarm-option__set-repeat-setting", {
    type: "button",
    text: "Repeat setting",
    description: `Alarm interval of <i>${repeatInterval}</i> min; automaticly silence after <i>${repeatTimes}</i> times`,
    value: `${repeatInterval};${repeatTimes}`,
  });

  $container.classList.add("alarm-modal");
  $container.dataset.alarmModalType = "settings";

  $content.classList.add("alarm-modal__content");

  $content.append($settingDuration, $repeatSetting);
  $container.append($header, $content);

  return $container;
};

export default CaAlarmSettingModal;
