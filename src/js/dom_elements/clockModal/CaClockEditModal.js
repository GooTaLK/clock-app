import { getInfoFromTimeZone, secondaryClocksState } from "../../modules/clock";
import CaModalHeader from "../modal/CaModalHeader";
import CaModalOption from "../modal/CaModalOption";

const CaClockEditModal = () => {
  const $container = document.createElement("div");
  const $content = document.createElement("div");
  const $header = CaModalHeader({
    headerClass: "clock-modal__edit",
    title: "Edit citys",
    close: { exist: true, dataName: "clockButton", dataValue: "close-modal" },
    check: { exist: true, dataName: "clockButton", dataValue: "save-edit" },
  });

  if (secondaryClocksState.length !== 0) {
    const orderOfClocks = secondaryClocksState.reduce(
      (listSorted, { timeZone, order }) => {
        const { area, local } = getInfoFromTimeZone(timeZone);

        listSorted[order] = CaModalOption("clock-option__edit-country", {
          type: "button",
          button: {
            text: `${local} ${area}`,
            value: timeZone,
            leftIcon: { className: "ca-i-three_bars" },
            rightIcon: { className: "ca-i-delete_circle" },
          },
        });

        return listSorted;
      },
      []
    );

    orderOfClocks.forEach((el) =>
      $content.insertAdjacentElement("afterbegin", el)
    );
  }

  $container.classList.add("clock-modal");
  $container.dataset.clockModalType = "edit";

  $content.classList.add("clock-modal__content");

  $container.append($header, $content);

  return $container;
};

export default CaClockEditModal;
