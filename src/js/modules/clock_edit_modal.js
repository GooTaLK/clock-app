import useOn from "../helpers/use_on";
import getDataOfParent from "../helpers/getDataOfParent";
import { isMobile as checkMobile } from "../helpers/detect_device";

import CaClockEditModal from "../dom_elements/clockModal/CaClockEditModal";
import { modal } from "./modal";
import { secondaryClocksState } from "./clock";
import { chargeSecondaryClocks } from "./clock_interface";

const isMobile = checkMobile();

const MOVE_EVENT = isMobile ? "touchmove" : "mousemove";
const DOWN_EVENT = isMobile ? "touchstart" : "mousedown";
const UP_EVENT = isMobile ? "touchend" : "mouseup";

const editState = {
  deleted: false,
  edited: false,
};

const trackDrag = (target, container, pageY) => {
  const topOfWrapper = target.parentElement.offsetTop;

  target.classList.add("item--dragging");
  target.style.position = "absolute";
  target.style.top = `${topOfWrapper}px`;
  container.dataset.initialPoint = pageY;
};

const unTrackDrag = (target, container) => {
  target.classList.remove("item--dragging");
  target.removeAttribute("style");
  container.removeAttribute("data-initial-point");
};

const getDragAfterElement = (container, itemSelector, y) => {
  const draggableElements = [
    ...container.querySelectorAll(`${itemSelector}:not(.item--dragging)`),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = box.height / 2 + box.top - y;
      if (offset > 0 && offset < closest.offset) {
        return { offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.POSITIVE_INFINITY }
  ).element;
};

const initClockEditModal = () => {
  useOn({
    typeEvent: "click",
    selector: "button[data-clock-button='edit']",
    callback: () => {
      modal.open({
        children: CaClockEditModal(),
        animation: "botToTop",
      });
    },
  });

  useOn({
    typeEvent: DOWN_EVENT,
    selector:
      "[data-clock-modal-type='edit'] .clock-option__edit-country button",
    callback: (e) => {
      if (e.target.matches(".ca-i-delete_circle")) return;

      const pageY = isMobile ? e.touches[0].pageY : e.pageY;
      const $container = document.querySelector(
        "[data-clock-modal-type='edit'] .clock-modal__content"
      );

      trackDrag(e.target, $container, pageY);
      editState.edited = true;
    },
    options: isMobile ? { passive: true } : false,
  });

  useOn({
    typeEvent: UP_EVENT,
    selector: "[data-clock-modal-type='edit'] .clock-modal__content",
    callback: () => {
      const $targetGrabbed = document.querySelector(".item--dragging");
      if ($targetGrabbed) {
        const $container = document.querySelector(
          "[data-clock-modal-type='edit'] .clock-modal__content"
        );
        unTrackDrag($targetGrabbed, $container);
      }
    },
  });

  useOn({
    typeEvent: MOVE_EVENT,
    selector: "[data-clock-modal-type='edit'] .clock-modal__content",
    callback: (e) => {
      const $targetGrabbed = document.querySelector(
        ".clock-option__edit-country button.item--dragging"
      );
      if (!$targetGrabbed) return;
      e.preventDefault();

      const $container = document.querySelector(
        "[data-clock-modal-type='edit'] .clock-modal__content"
      );

      const pageY = isMobile ? e.touches[0].pageY : e.pageY;
      const clientY = isMobile ? e.touches[0].clientY : e.clientY;

      const moveY = pageY - Number($container.dataset.initialPoint);
      const afterElement = getDragAfterElement(
        $container,
        ".clock-option__edit-country button",
        clientY
      );

      $targetGrabbed.style.transform = `translateY(${moveY}px)`;
      $targetGrabbed.style.zIndex = 10;

      if (afterElement) {
        $container.insertBefore(
          $targetGrabbed.parentElement,
          afterElement.parentElement
        );
      } else {
        $container.appendChild($targetGrabbed.parentElement);
      }
    },
    options: isMobile ? { passive: true } : false,
  });

  useOn({
    typeEvent: "click",
    selector: ".clock-option__edit-country .ca-i-delete_circle",
    callback: ({ target }) => {
      target.parentElement.parentElement.remove();
      editState.deleted = true;
    },
  });

  useOn({
    typeEvent: "click",
    selector: "[data-clock-button='close-modal']",
    callback: ({ target }) => {
      const modalType = getDataOfParent(target, "clockModalType");
      if (modalType !== "edit") return;

      if (editState.deleted || editState.edited) {
        editState.deleted = true;
        editState.edited = true;
      }

      modal.close({});
    },
  });

  useOn({
    typeEvent: "click",
    selector: "[data-clock-button='save-edit']",
    callback: () => {
      if (editState.deleted || editState.edited) {
        const $clockList = document.querySelectorAll(
          ".clock-option__edit-country"
        );
        const orderedClocks = [...$clockList].reverse().map((el, index) => {
          return {
            timeZone: el.querySelector("button").value,
            order: index + 1,
          };
        });

        secondaryClocksState.splice(0);
        secondaryClocksState.push(...orderedClocks);
        localStorage.removeItem("clock-data");
        localStorage.setItem("clock-data", JSON.stringify(orderedClocks));

        chargeSecondaryClocks();

        editState.deleted = true;
        editState.edited = true;
      }

      modal.close({});
    },
  });
};

export default initClockEditModal;
