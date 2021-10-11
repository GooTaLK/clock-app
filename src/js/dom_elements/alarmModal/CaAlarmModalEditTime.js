import { addCeroAhead } from "../../helpers/date_formater";

const CaAlarmModalEditTime = (rotateOfLeft = 0, rotateOfRight = 0) => {
  const $container = document.createElement("div");
  const $leftWheel = document.createElement("div");
  const $leftWheelContainer = document.createElement("button");
  const $rightWheel = document.createElement("div");
  const $rightWheelContainer = document.createElement("button");
  const hoursValues = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 0,
  ];
  const minutesValues = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 56, 54, 55, 56, 57, 58, 59,
    0,
  ];

  const handleInsertValues = (value, target) => {
    const $span = document.createElement("span");
    $span.textContent = value;

    target.appendChild($span);
  };

  hoursValues
    .reverse()
    .forEach((value) => handleInsertValues(value, $leftWheel));
  minutesValues
    .reverse()
    .forEach((value) => handleInsertValues(value, $rightWheel));

  $leftWheel.classList.add("left-wheel-time");
  $leftWheel.dataset.angleToAdjust = "15";

  $rightWheel.classList.add("right-wheel-time");
  $rightWheel.dataset.angleToAdjust = "6";

  $leftWheelContainer.classList.add("left-wheel-container");
  $leftWheelContainer.style.setProperty("--rotate-x", `${rotateOfLeft}deg`);
  $leftWheelContainer.name = "leftWheel";
  $leftWheelContainer.value = rotateOfLeft / 15;

  $rightWheelContainer.classList.add("right-wheel-container");
  $rightWheelContainer.style.setProperty("--rotate-x", `${rotateOfRight}deg`);
  $rightWheelContainer.name = "rightWheel";
  $rightWheelContainer.value = addCeroAhead(rotateOfRight / 6);

  $container.classList.add("ca-alarm-modal-edit-option");

  $leftWheelContainer.appendChild($leftWheel);
  $rightWheelContainer.appendChild($rightWheel);
  $container.append($leftWheelContainer, $rightWheelContainer);

  return $container;
};

export default CaAlarmModalEditTime;
