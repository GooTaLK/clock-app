import defaultAlarmModalSettingsSet from "../../data/alarm_default_data/modal_settings_set.json";
import defaultAlarmSecondModalSetRingDuration from "../../data/alarm_default_data/second_modal_set_ring_duration.json";
import defaultAlarmSecondModalSetRepeatSettings from "../../data/alarm_default_data/second_modal_set_repeat_settings.json";

import useOn from "../helpers/use_on";
import getDataOfParent from "../helpers/getDataOfParent";
import {
  getLocalData,
  updateAllLocalData,
} from "../helpers/JSONAndLocalStorage";

import CaAlarmSettingModal from "../dom_elements/alarmModal/CaAlarmSettingModal";

const initAlarmSettingsModal = ({
  modal,
  secondModal,
  CaSecondModal,
  initDefaultData,
  setValueFromOption,
  insertValuesInDefault,
  moveToolContainerX,
}) => {
  initDefaultData("alarm-settings-set", defaultAlarmModalSettingsSet);

  useOn({
    typeEvent: "click",
    selector: "button[data-alarm-button='settings']",
    callback: () => {
      const settingsSet = getLocalData("alarm-settings-set")[0];

      modal.open({
        children: CaAlarmSettingModal(settingsSet),
        animation: "rightToLeft",
      });
      moveToolContainerX("-100vw");
    },
  });

  useOn({
    typeEvent: "click",
    selector: "[data-alarm-button='close-modal']",
    callback: ({ target }) => {
      const modalType = getDataOfParent(target, "alarmModalType");
      if (modalType !== "settings") return;

      modal.close({});
      moveToolContainerX("0vw");
    },
  });

  useOn({
    typeEvent: "click",
    selector: ".alarm-option__set-ring-duration button",
    callback: ({ target }) => {
      const value = Number(target.value);
      const ringSetOptions = insertValuesInDefault(
        defaultAlarmSecondModalSetRingDuration,
        [value],
        { active: true }
      );

      secondModal.open({
        children: CaSecondModal({
          title: "Ring duration",
          content: {
            type: "options",
            options: ringSetOptions,
          },
          buttons: [
            {
              text: "Cancel",
              dataset: "close",
            },
          ],
        }),
        animation: "opacity1",
      });
    },
  });

  useOn({
    typeEvent: "click",
    selector: "[data-sm-option='alarm set ring duration']",
    callback: ({ target }) => {
      const isActive = setValueFromOption({
        target,
        buttonSelector: ".alarm-option__set-ring-duration button",
        valueTag: "i",
      });

      !isActive &&
        updateAllLocalData("alarm-settings-set", {
          ringDuration: Number(target.value),
        });

      secondModal.close({});
    },
  });

  useOn({
    typeEvent: "click",
    selector: ".alarm-option__set-repeat-setting button",
    callback: ({ target }) => {
      const values = target.value.split(";");
      const repeatSetRanges = defaultAlarmSecondModalSetRepeatSettings.map(
        (obj, index) => {
          return { ...obj, value: values[index] };
        }
      );

      secondModal.open({
        children: CaSecondModal({
          title: "Repeat settings",
          content: {
            type: "ranges",
            ranges: repeatSetRanges,
          },
          buttons: [
            { text: "Cancel", dataset: "close" },
            { text: "Accept", className: "alarm-set__repeat-setting__accept" },
          ],
        }),
        animation: "opacity1",
        next: () => {
          const $ranges = document.querySelectorAll(
            ".second-modal__frame-content .ca-range_input"
          );
          const rangeDataNames = ["alarm intervals", "ring times"];
          const rangeIntervals = {
            "alarm intervals": ["5", "10", "15", "20", "25", "30"],
            "ring times": ["1", "3", "5", "10"],
          };

          $ranges.forEach((range) => {
            const rangeName = range.parentElement.dataset.smRangeName;
            if (!rangeDataNames.includes(rangeName)) return;

            const intervals = rangeIntervals[rangeName];
            const part = intervals.indexOf(String(range.value));
            const total = intervals.length - 1;
            const percentage = (part / total) * 100;
            const x = (percentage / 100) * range.clientWidth;

            range.style.setProperty("--v", `${percentage}%`);
            range.style.setProperty("--x", `${x}px`);
          });
        },
      });
    },
  });

  useOn({
    typeEvent: "click",
    selector: ".alarm-set__repeat-setting__accept",
    callback: () => {
      const $intervalRangeValue = document.querySelector(
        "[data-sm-range-name='alarm intervals'] button"
      ).value;
      const $timesRangeValue = document.querySelector(
        "[data-sm-range-name='ring times'] button"
      ).value;
      const $repeatSettingButton = document.querySelector(
        ".alarm-option__set-repeat-setting button"
      );
      const $i = $repeatSettingButton.querySelectorAll("i");

      $repeatSettingButton.value = `${$intervalRangeValue};${$timesRangeValue}`;
      $i[0].textContent = $intervalRangeValue;
      $i[1].textContent = $timesRangeValue;

      updateAllLocalData("alarm-settings-set", {
        repeatInterval: Number($intervalRangeValue),
        repeatTimes: Number($timesRangeValue),
      });
      secondModal.close({});
    },
  });
};

export default initAlarmSettingsModal;
