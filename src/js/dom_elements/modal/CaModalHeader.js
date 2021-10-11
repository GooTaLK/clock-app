const CaModalHeader = ({ headerClass, title, close, check }) => {
  const $header = document.createElement("div");
  const $title = document.createElement("span");

  $header.classList.add("ca-modal-header");
  headerClass && $header.classList.add(headerClass);

  $title.textContent = title;

  if (close) {
    const $close = document.createElement("span");
    $close.classList.add("ca-i-times");
    $close.dataset.alarmButton = "close-modal";
    $header.appendChild($close);
  }

  $header.appendChild($title);

  if (check) {
    const $check = document.createElement("span");
    $check.classList.add("ca-i-check");
    $check.dataset.alarmButton = "save";
    $header.appendChild($check);
  }

  return $header;
};

export default CaModalHeader;
