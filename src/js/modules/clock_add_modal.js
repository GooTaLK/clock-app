import useOn from "../helpers/use_on";
import getDataOfParent from "../helpers/getDataOfParent";
import { addLocalData } from "../helpers/JSONAndLocalStorage";

import CaClockAddModal from "../dom_elements/clockModal/CaClockAddModal";
import CaBtnGroup from "../dom_elements/CaBtnGroup";
import CaSecondaryClockChild from "../dom_elements/CaSecondaryClockChild";
import { getInfoFromTimeZone, secondaryClocksState } from "./clock";
import { modal } from "./modal";

const $clockButtons = document.getElementById("clockButtons");
const $clockEditButton = document.querySelector(
  "[data-clock-button='edit']"
).parentElement;

const initclockAddModal = () => {
  useOn({
    typeEvent: "click",
    selector: "button[data-clock-button='add']",
    callback: () => {
      modal.open({
        children: CaClockAddModal(),
        animation: "botToTop",
      });
    },
  });

  useOn({
    typeEvent: "click",
    selector: "[data-clock-button='close-modal']",
    callback: ({ target }) => {
      const modalType = getDataOfParent(target, "clockModalType");
      if (modalType !== "add") return;

      modal.close({});
    },
  });

  useOn({
    typeEvent: "click",
    selector: ".clock-option__add-country",
    callback: ({ target }) => {
      const value = target.value;
      const { local, strTimeDescription } = getInfoFromTimeZone(value);

      $clockButtons.insertAdjacentElement(
        "afterbegin",
        CaBtnGroup({
          className: `secondary-clock`,
          name: local,
          dataset: { name: "clockTimeZone", value },
          child: CaSecondaryClockChild({ strTimeDescription }),
        })
      );
      secondaryClocksState.push({ timeZone: value });
      addLocalData("clock-data", { timeZone: value });

      $clockEditButton.classList.remove("display-none");
      modal.close({});
    },
  });
};

export default initclockAddModal;
