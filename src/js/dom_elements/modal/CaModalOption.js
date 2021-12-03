const createIcon = (className, text) => {
  const $i = document.createElement("i");

  $i.classList.add(className);

  if (text) {
    const $span = document.createElement("span");
    $span.textContent = text;
    $i.appendChild($span);
  }

  return $i;
};

const CaModalOption = (
  className,
  {
    type,
    text,
    children,
    button = {
      text: String,
      value: String,
      name: String,
      description: String,
      leftIcon: { className: String, text: String },
      rightIcon: { className: String, text: String },
    },
    switchButton = { text: String, name: String, value: String },
  }
) => {
  const $container = document.createElement("div");

  $container.classList.add("ca-modal-option");
  className && $container.classList.add(className);

  switch (type) {
    case "text":
      $container.textContent = text;
      return $container;

    case "children":
      $container.appendChild(children);
      return $container;

    case "button":
      const $button = document.createElement("button");
      const $content = document.createElement("div");

      $button.classList.add("ca-modal-option-btn");
      button.value && ($button.value = button.value);
      button.name && ($button.name = button.name);

      $content.textContent = button.text;

      if (button.description) {
        const $p = document.createElement("p");
        $p.innerHTML = button.description;
        $content.appendChild($p);
      }

      if (button.leftIcon) {
        const $leftIcon = createIcon(
          button.leftIcon.className,
          button.leftIcon.text
        );
        $button.appendChild($leftIcon);
      }

      $button.appendChild($content);

      if (button.rightIcon) {
        const $rightIcon = createIcon(
          button.rightIcon.className,
          button.rightIcon.text
        );
        $button.appendChild($rightIcon);
      }

      $container.appendChild($button);

      return $container;

    case "switchButton":
      const $switchButton = document.createElement("button");
      const $switchSpan = document.createElement("span");

      $switchButton.classList.add("ca-modal-option-check-btn");
      $switchButton.textContent = switchButton.text;
      switchButton.name && ($switchButton.name = switchButton.name);
      switchButton.value && ($switchButton.value = switchButton.value);

      $switchSpan.classList.add("ca-i-switch");
      if (switchButton.value && switchButton.value === "On")
        $switchSpan.classList.add("ca-i-switch--active");

      $switchButton.appendChild($switchSpan);
      $container.appendChild($switchButton);

      return $container;

    default:
      $container.textContent = "No child";
      return $container;
  }
};

export default CaModalOption;
