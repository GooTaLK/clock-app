const CaAlarmCard = ({ time, name, repeatAt, active, id }) => {
  const $card = document.createElement("button");
  const $cardContent = document.createElement("div");
  const $time = document.createElement("span");
  const $details = document.createElement("span");
  const $switch = document.createElement("span");

  $card.classList.add("alarm-content__card");
  $card.dataset.alarmId = id;
  $card.dataset.alarmButton = "edit";
  active && $card.classList.add("alarm-content__card--active");

  $cardContent.classList.add("alarm-content__card__content");

  $time.classList.add("alarm-content__card__time");
  $time.textContent = time;

  $details.classList.add("alarm-content__card__details");
  $details.textContent = `${name}. ${repeatAt}.`;

  $switch.classList.add("ca-i-switch");
  active && $switch.classList.add("ca-i-switch--active");

  $cardContent.append($time, $details);
  $card.append($cardContent, $switch);

  return $card;
};

export default CaAlarmCard;
