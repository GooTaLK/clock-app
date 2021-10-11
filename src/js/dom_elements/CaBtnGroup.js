const CaBtnGroup = ({ className, name, child }) => {
  const $btnGroup = document.createElement("div");
  const $button = document.createElement("button");
  const $span = document.createElement("span");

  $btnGroup.classList.add("ca-btn_group");
  $btnGroup.classList.add(className);

  $button.insertAdjacentHTML("afterbegin", child);

  $span.textContent = name;

  $btnGroup.append($button, $span);

  return $btnGroup;
};

export default CaBtnGroup;
