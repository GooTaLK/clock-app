import { addCeroAhead } from "../helpers/date_formater";
import IS_MOBILE from "../helpers/detect_device";
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

const initWheel = (side) => {
  if (side !== "left" && side !== "right") return;

  const isLeft = side === "left";
  const selector = isLeft ? ".left-wheel-container" : ".right-wheel-container";

  const downEvent = IS_MOBILE ? "touchstart" : "mousedown";
  const upEvent = IS_MOBILE ? "touchend" : "mouseup";
  const moveEvent = IS_MOBILE ? "touchmove" : "mousemove";

  let touchPoint = 0;

  wheels[side].mouseLeaveListener = () => {
    if (IS_MOBILE) return [() => null, () => null];

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
    typeEvent: downEvent,
    selector,
    callback: (e) => {
      const target = document.querySelector(`.${side}-wheel-time`);

      IS_MOBILE && (touchPoint = e.touches[0].screenY);

      target.parentElement.classList.add(`${side}-wheel-time--grabbing`);
      target.classList.remove(`${side}-wheel-time--adjustment`);
    },
  });

  useOn({
    typeEvent: upEvent,
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
    typeEvent: moveEvent,
    selector,
    callback: (e) => {
      if (!IS_MOBILE && e.buttons !== 1) return;
      const target = document.querySelector(`.${side}-wheel-time`);

      const getMovementY = () => {
        if (!IS_MOBILE) return e.movementY;

        const float = e.touches[0].screenY - touchPoint;
        touchPoint = e.touches[0].screenY;
        return float;
      };

      const slower = IS_MOBILE
        ? { left: 0.3, right: 0.15 }
        : { left: 0.5, right: 0.25 };
      const walk = getMovementY() * slower[side];

      wheels[side].rotateValue -= walk;
      wheels[side].rotateValue = fixRotateValue(wheels[side].rotateValue);
      target.style.setProperty("--rotate-x", `${wheels[side].rotateValue}deg`);
    },
  });
};

export default initWheel;
export { wheels };
