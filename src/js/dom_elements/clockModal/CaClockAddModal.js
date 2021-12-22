import { aryIannaTimeZones } from "../../helpers/date_utilities";

import { getInfoFromTimeZone, secondaryClocksState } from "../../modules/clock";
import CaModalHeader from "../modal/CaModalHeader";
import CaModalOption from "../modal/CaModalOption";

const SearchInput = () => {
  const $input = document.createElement("input");
  $input.classList.add("ca-long-input");
  $input.type = "search";
  $input.placeholder = "Search city";

  return $input;
};

const CaClockAddModal = () => {
  const date = new Date();

  const $container = document.createElement("div");
  const $content = document.createElement("div");
  const $header = CaModalHeader({
    headerClass: "clock-modal__add",
    title: "Add city",
    close: { exist: true, dataName: "clockButton", dataValue: "close-modal" },
  });

  const $searchInputOption = CaModalOption("clock-option__search-input", {
    type: "children",
    children: SearchInput(),
  });

  Promise.resolve().then(() => {
    aryIannaTimeZones.forEach((timeZone) => {
      const { area, local, strTimeDescription } = getInfoFromTimeZone(
        timeZone,
        date
      );

      const $countryOption = CaModalOption("clock-option__add-country", {
        type: "button",
        button: {
          text: `${local}(${area})`,
          description: strTimeDescription,
          value: timeZone,
        },
      });

      $content.appendChild($countryOption);
    });
  });

  $container.classList.add("clock-modal");
  $container.dataset.clockModalType = "add";

  $content.classList.add("clock-modal__content");

  $content.insertAdjacentElement("afterbegin", $searchInputOption);
  $container.append($header, $content);

  return $container;
};

export default CaClockAddModal;
