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
        if (!selector) {
          callback(e);
          return;
        }

        const match =
          e.target.matches(selector) || e.target.matches(`${selector} *`);

        match ? callback(e) : callbackIfNotMatch(e);
      },
      options
    );
  }
};

export default useOn;
