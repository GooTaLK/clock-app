import useOn from "../helpers/use_on";

let down = false;

const setValue = (setX, target) => {
  if (!down) return;

  const width = target.clientWidth;
  const x = setX >= width ? width : setX <= 0 ? 0 : setX;
  const value = (x / width) * 100;

  target.style.setProperty("--x", `${x}px`);
  target.style.setProperty("--v", `${value}%`);
  target.value = Math.round(value * 100) / 100;
};

useOn({
  typeEvent: "mousedown",
  selector: ".ca-range_input",
  callback: ({ offsetX, target }) => {
    down = true;
    setValue(offsetX, target);
  },
});

useOn({
  typeEvent: "mousemove",
  selector: ".ca-range_input",
  callback: ({ offsetX, target }) => setValue(offsetX, target),
});

useOn({
  typeEvent: "mouseup",
  selector: ".second-modal__frame-range",
  callback: () => (down = false),
});
