import defaultTimerSecondModalRings from "../../data/timer/second_modal_rings.json";

import useOn from "../helpers/use_on";

import CaSecondModal from "../dom_elements/modal/CaSecondModal";
import { secondModal } from "./modal";
import { setTimerRing, timerState } from "./timer";

const initTimerRingModal = ({ modifyOptionSet, changeOption }) => {
  useOn({
    typeEvent: "click",
    selector: "button[data-timer-button='ring']",
    callback: () => {
      const ringsOptions = modifyOptionSet(
        defaultTimerSecondModalRings,
        [timerState.ring],
        { active: true }
      );

      secondModal.open({
        children: CaSecondModal({
          title: "Timer rings",
          content: {
            type: "options",
            options: ringsOptions,
          },
          buttons: [{ text: "Back", dataset: "close" }],
        }),
        animation: "opacity1",
      });
    },
  });

  useOn({
    typeEvent: "click",
    selector: "[data-sm-option='timer set ring']",
    callback: ({ target }) => {
      changeOption({ target });
      setTimerRing(target.value);
      secondModal.close({});
    },
  });
};

export { initTimerRingModal };
