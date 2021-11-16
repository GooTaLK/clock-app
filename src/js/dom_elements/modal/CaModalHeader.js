const CaModalHeader = ({
  headerClass,
  title,
  close = { exist: false, dataName: String, dataValue: String },
  check = { exist: false, dataName: String, dataValue: String },
}) => {
  const $header = document.createElement("div");
  const $title = document.createElement("span");

  $header.classList.add("ca-modal-header");
  headerClass && $header.classList.add(headerClass);

  $title.textContent = title;

  if (close.exist) {
    const $close = document.createElement("span");
    $close.classList.add("ca-i-times");
    $close.dataset[close.dataName] = close.dataValue;
    $header.appendChild($close);
  }

  $header.appendChild($title);

  if (check.exist) {
    const $check = document.createElement("span");
    $check.classList.add("ca-i-check");
    $check.dataset[check.dataName] = check.dataValue;
    $header.appendChild($check);
  }

  return $header;
};

export default CaModalHeader;
