import SSWheel from "../helpers/SSWheel";

const docSSW = new SSWheel({
  wrapper: document.documentElement,
  distance: 60,
  speed: 1 / 20,
});

docSSW.init();
