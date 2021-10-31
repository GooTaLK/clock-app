import { capitalize } from "../helpers/capitalize";

const CaAlarmCard = ({ time, name, repeat, customRepeat, active, id }) => {
  const $card = document.createElement("button");
  const $cardContent = document.createElement("div");
  const $time = document.createElement("span");
  const $details = document.createElement("p");
  const $repeatText = document.createElement("span");
  const $switch = document.createElement("span");

  const fillRepeatText = () => {
    if (!customRepeat) return repeat;

    $repeatText.classList.add("alarm-custom-repeat-text");

    return repeat
      .split(";")
      .map((value) => capitalize(value))
      .join(", ");
  };

  $card.classList.add("alarm-content__card");
  $card.dataset.alarmId = id;
  $card.dataset.alarmButton = "edit";
  active && $card.classList.add("alarm-content__card--active");

  $cardContent.classList.add("alarm-content__card__content");

  $time.classList.add("alarm-content__card__time");
  $time.textContent = time;

  $details.classList.add("alarm-content__card__details");
  $details.textContent = `${name}. `;

  $repeatText.textContent = `${fillRepeatText()}.`;

  $switch.classList.add("ca-i-switch");
  active && $switch.classList.add("ca-i-switch--active");

  $details.appendChild($repeatText);
  $cardContent.append($time, $details);
  $card.append($cardContent, $switch);

  return $card;
};

export default CaAlarmCard;
