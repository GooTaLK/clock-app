const CaSecondModal = ({
  title,
  content = {
    type: String,
    text: String,
    options: [
      {
        text: String,
        value: String,
        dataset: String,
        checkIcon: Boolean,
        active: Boolean,
      },
    ],
    ranges: [{ text: String, intervals: [String], dataset: String }],
    input: { value: String },
  },
  buttons = [{ text: String, className: String, dataset: String }],
}) => {
  const $container = document.createElement("div");
  const $frame = document.createElement("div");
  const $title = document.createElement("p");
  const $frameContent = document.createElement("div");
  const $btnGroup = document.createElement("div");

  const createContent = (type) => {
    const allowTypes = ["text", "options", "ranges", "input"];
    if (!allowTypes.includes(type)) return;

    const typeFunctions = {
      text: () => {
        $frameContent.textContent = content.text;
        $frameContent.dataset.secondModalType = "text";
      },
      options: () => {
        content.options.forEach(
          ({ text, value, dataset, checkIcon, active = false }) => {
            const $option = document.createElement("button");
            const $icon = document.createElement("span");

            if (checkIcon) {
              $icon.classList.add("ca-i-check_circle");
              active && $icon.classList.add("ca-i-check_circle--active");
            } else {
              $icon.classList.add("ca-i-turn_circle");
              active && $icon.classList.add("ca-i-turn_circle--active");
            }

            $option.classList.add("second-modal__frame-option");
            $option.textContent = text;
            $option.value = value;
            $option.dataset.smOption = dataset;

            $option.appendChild($icon);
            $frameContent.appendChild($option);
          }
        );

        $frameContent.dataset.secondModalType = "options";
      },
      ranges: () => {
        content.ranges.forEach(({ text, intervals, dataset }) => {
          const $rangeContainer = document.createElement("div");
          const $label = document.createElement("label");
          const $range = document.createElement("button");
          const $intervals = document.createElement("div");

          $rangeContainer.classList.add("second-modal__frame-range");
          $rangeContainer.dataset.smRangeName = dataset;

          $label.textContent = text;

          $range.classList.add("ca-range_input");

          $intervals.classList.add("ca-sm-intervals");
          intervals.forEach((intervalText) => {
            const $interval = document.createElement("span");
            $interval.textContent = intervalText;
            $intervals.appendChild($interval);
          });

          $rangeContainer.append($label, $range, $intervals);
          $frameContent.appendChild($rangeContainer);
        });

        $frameContent.dataset.secondModalType = "ranges";
      },
      input: () => {
        const $input = document.createElement("input");

        $input.value = content.input.value;

        $frameContent.appendChild($input);
        $frameContent.dataset.secondModalType = "input";
      },
    };

    typeFunctions[type]();
  };

  const createButtons = () => {
    buttons.forEach(({ text, className, dataset }) => {
      const $button = document.createElement("button");

      $button.classList.add("second-modal__frame-btn");
      className && $button.classList.add(className);
      dataset && ($button.dataset.smBtn = dataset);
      $button.textContent = text;

      $btnGroup.appendChild($button);
    });
  };

  const additionalElements = (type) => {
    const allowTypes = ["options"];
    if (!allowTypes.includes(type)) return;

    const typeFunctions = {
      options: () => {
        const $fog = document.createElement("hr");
        $fog.classList.add("second-modal__frame-content-fog");
        $frameContent.after($fog);
      },
    };

    typeFunctions[type]();
  };

  $container.classList.add("second-modal");

  $frame.classList.add("second-modal__frame");

  $title.classList.add("second-modal__frame-title");
  $title.textContent = title;

  $frameContent.classList.add("second-modal__frame-content");
  createContent(content.type);

  $btnGroup.classList.add("second-modal__frame-buttons");
  createButtons();

  $frame.append($title, $frameContent, $btnGroup);
  $container.appendChild($frame);
  additionalElements(content.type);

  return $container;
};

export default CaSecondModal;
