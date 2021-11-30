const CaBtnGroup = ({
  className,
  name,
  dataset = { name: String, value: String },
  child,
}) => {
  const $btnGroup = document.createElement("div");
  const $button = document.createElement("button");
  const $span = document.createElement("span");

  $btnGroup.classList.add("ca-btn_group");
  className && $btnGroup.classList.add(className);
  dataset && ($btnGroup.dataset[dataset.name] = dataset.value);

  $button.insertAdjacentElement("afterbegin", child);

  $span.textContent = name;

  $btnGroup.append($button, $span);

  return $btnGroup;
};

export default CaBtnGroup;
