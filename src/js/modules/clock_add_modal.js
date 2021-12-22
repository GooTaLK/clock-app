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
    typeEvent: "keyup",
    selector: ".clock-option__search-input input",
    callback: (e) => {
      if (e.key === "Escape") e.target.value = "";

      const value = e.target.value.toLowerCase();

      document
        .querySelectorAll(".clock-option__add-country")
        .forEach((el) =>
          el.textContent.toLowerCase().includes(value)
            ? el.classList.remove("display-none")
            : el.classList.add("display-none")
        );
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

      const order = secondaryClocksState.length + 1;

      secondaryClocksState.push({ timeZone: value, order });
      addLocalData("clock-data", { timeZone: value, order });

      $clockEditButton.classList.remove("display-none");
      modal.close({});
    },
  });
};

export default initclockAddModal;
