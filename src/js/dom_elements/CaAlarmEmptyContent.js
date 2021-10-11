const AlarmEmptyContent = () => {
  const $frontage = document.createElement("div");
  const $image = document.createElement("img");
  const $p = document.createElement("p");
  const $button = document.createElement("button");

  $frontage.classList.add("alarm-content--empty__frontage");

  $image.src = "assets/Clock.svg";
  $image.alt = "Alarm stage";

  $p.textContent = "No alarms";

  $button.classList.add("ca-long-btn");
  $button.dataset.alarmButton = "add";
  $button.textContent = "New alarm";

  $frontage.append($image, $p);

  return [$frontage, $button];
};

export default AlarmEmptyContent;
