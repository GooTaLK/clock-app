import { addCeroAhead } from "../helpers/date_formater";
import useOn from "../helpers/use_on";

const wheels = {
  left: {
    rotateValue: 0,
    mouseLeaveListener: null,
  },
  right: {
    rotateValue: 0,
    mouseLeaveListener: null,
  },
};

const adjustRotate = (rotateValue, target, side) => {
  const parent = target.parentElement;
  const angle = target.dataset.angleToAdjust;
  const newRotateValue = Math.round(rotateValue / angle) * angle;

  target.classList.add(`${side}-wheel-time--adjustment`);
  side === "right"
    ? (parent.value = addCeroAhead(newRotateValue / angle))
    : (parent.value = (newRotateValue === 360 ? 0 : newRotateValue) / angle);
  setTimeout(
    () => target.style.setProperty("--rotate-x", `${newRotateValue}deg`),
    0
  );
  setTimeout(
    () => target.classList.remove(`${side}-wheel-time--adjustment`),
    500
  );

  return newRotateValue;
};

const fixRotateValue = (rotateValue) => {
  if (rotateValue >= 360) {
    return rotateValue - 360;
  } else if (rotateValue >= 0) {
    return rotateValue;
  } else if (rotateValue < 0) {
    return rotateValue + 360;
  }
};

const initWheelInEditModal = (side) => {
  if (side !== "left" && side !== "right") return;

  const isLeft = side === "left" ? true : false;
  const selector = isLeft ? ".left-wheel-container" : ".right-wheel-container";

  wheels[side].mouseLeaveListener = () => {
    return useOn({
      mode: "selector",
      typeEvent: "mouseleave",
      selector,
      callback: () => {
        const target = document.querySelector(`.${side}-wheel-time`);
        target.parentElement.classList.remove(`${side}-wheel-time--grabbing`);
        wheels[side].rotateValue = adjustRotate(
          wheels[side].rotateValue,
          target,
          side
        );
      },
    });
  };

  useOn({
    typeEvent: "mousedown",
    selector,
    callback: () => {
      const target = document.querySelector(`.${side}-wheel-time`);

      target.parentElement.classList.add(`${side}-wheel-time--grabbing`);
      target.classList.remove(`${side}-wheel-time--adjustment`);
    },
  });

  useOn({
    typeEvent: "mouseup",
    selector,
    callback: () => {
      const target = document.querySelector(`.${side}-wheel-time`);

      target.parentElement.classList.remove(`${side}-wheel-time--grabbing`);
      wheels[side].rotateValue = adjustRotate(
        wheels[side].rotateValue,
        target,
        side
      );
    },
  });

  useOn({
    typeEvent: "mousemove",
    selector,
    callback: (e) => {
      if (e.buttons !== 1) return;
      e.preventDefault();
      const target = document.querySelector(`.${side}-wheel-time`);
      const walk = isLeft ? e.movementY / 2 : e.movementY / 4;

      wheels[side].rotateValue -= walk;
      wheels[side].rotateValue = fixRotateValue(wheels[side].rotateValue);
      target.style.setProperty("--rotate-x", `${wheels[side].rotateValue}deg`);
    },
  });
};

export default initWheelInEditModal;
export { wheels };
