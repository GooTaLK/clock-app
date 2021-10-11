const CaModalOption = (
  optionClass,
  { type, text, children, value, name, chevronText, description }
) => {
  const $optionContainer = document.createElement("div");

  $optionContainer.classList.add("ca-modal-option");
  $optionContainer.classList.add(optionClass);

  switch (type) {
    case "text":
      $optionContainer.textContent = text;
      return $optionContainer;

    case "children":
      $optionContainer.appendChild(children);
      return $optionContainer;

    case "button":
      const $button = document.createElement("button");
      const $content = document.createElement("div");
      const $span = document.createElement("span");

      $button.classList.add("ca-modal-option-btn");
      value && ($button.value = value);
      name && ($button.name = name);

      $content.textContent = text;

      $span.classList.add("ca-i-chevron");
      chevronText && ($span.textContent = chevronText);

      if (description) {
        const $p = document.createElement("p");
        $p.innerHTML = description;
        $content.appendChild($p);
      }

      $button.append($content, $span);
      $optionContainer.appendChild($button);

      return $optionContainer;

    case "switchButton":
      const $switchButton = document.createElement("button");
      const $switchSpan = document.createElement("span");

      $switchButton.classList.add("ca-modal-option-check-btn");
      $switchButton.textContent = text;
      name && ($switchButton.name = name);
      value && ($switchButton.value = value);

      $switchSpan.classList.add("ca-i-switch");
      if (value && value === "On")
        $switchSpan.classList.add("ca-i-switch--active");

      $switchButton.appendChild($switchSpan);
      $optionContainer.appendChild($switchButton);

      return $optionContainer;

    default:
      $optionContainer.textContent = "No cshild";
      return $optionContainer;
  }
};

export default CaModalOption;
