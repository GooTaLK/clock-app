const useOn = (
  typeEvent,
  selector,
  callback,
  callbackIfNotMatch = () => null
) => {
  document.addEventListener(typeEvent, (e) => {
    const match =
      e.target.matches(selector) || e.target.matches(`${selector} *`);

    if (!match) {
      callbackIfNotMatch(e);
      return;
    }

    callback();
  });
};

export default useOn;
