const useOn = ({
  mode = "DOM",
  typeEvent,
  selector,
  element,
  callback,
  callbackIfNotMatch = () => null,
  options = false,
}) => {
  if (mode === "element") {
    const addListener = () =>
      element.addEventListener(typeEvent, callback, options);
    const removeListener = () =>
      element.removeEventListener(typeEvent, callback, options);

    return [addListener, removeListener];
  } else if (mode === "selector") {
    const $element = document.querySelector(selector);
    const addListener = () =>
      $element.addEventListener(typeEvent, callback, options);
    const removeListener = () =>
      $element.removeEventListener(typeEvent, callback, options);

    return [addListener, removeListener];
  } else if (mode === "DOM") {
    document.addEventListener(
      typeEvent,
      (e) => {
        const match =
          e.target.matches(selector) || e.target.matches(`${selector} *`);

        if (!match) {
          callbackIfNotMatch(e);
          return;
        }

        callback(e);
      },
      options
    );
  }
};

export default useOn;
