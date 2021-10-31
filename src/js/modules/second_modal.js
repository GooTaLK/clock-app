import getDataOfParent from "../helpers/getDataOfParent";
import useOn from "../helpers/use_on";

const initSecondModal = ({ secondModal }) => {
  useOn({
    typeEvent: "click",
    selector: "[data-sm-btn='close']",
    callback: () => {
      secondModal.close({});
    },
  });

  useOn({
    typeEvent: "mouseup",
    selector: ".second-modal__frame-range",
    callback: ({ target }) => {
      const rangeName = getDataOfParent(target, "smRangeName");
      const $rangeAlarmIntervals = document.querySelector(
        "[data-sm-range-name='alarm intervals'] .ca-range_input"
      );
      const $rangeRingTimes = document.querySelector(
        "[data-sm-range-name='ring times'] .ca-range_input"
      );

      if (rangeName === "alarm intervals") {
        const value = $rangeAlarmIntervals.value;
        const inValue = Math.round(value / 20) * 20;
        const outValues = { 0: 5, 20: 10, 40: 15, 60: 20, 80: 25, 100: 30 };
        const width = $rangeAlarmIntervals.clientWidth;
        const x = (inValue / 100) * width;

        $rangeAlarmIntervals.value = outValues[String(inValue)];
        $rangeAlarmIntervals.style.setProperty("--v", `${inValue}%`);
        $rangeAlarmIntervals.style.setProperty("--x", `${x}px`);
      }
      if (rangeName === "ring times") {
        const value = $rangeRingTimes.value;
        const inValue = Math.trunc(Math.round(value / (100 / 3)) * (100 / 3));
        const outValues = { 0: 1, 33: 3, 66: 5, 100: 10 };
        const width = $rangeRingTimes.clientWidth;
        const x = (inValue / 100) * width;

        $rangeRingTimes.value = outValues[String(inValue)];
        $rangeRingTimes.style.setProperty("--v", `${inValue}%`);
        $rangeRingTimes.style.setProperty("--x", `${x}px`);
      }
    },
  });
};

export default initSecondModal;
