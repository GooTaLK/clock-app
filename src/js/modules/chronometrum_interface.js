import useOn from "../helpers/use_on";
import SSWheel from "../helpers/SSWheel";

const $chronometrumContent = document.querySelector(".chronometrum-content");

const chronometrumSSWheel = new SSWheel({
  wrapper: $chronometrumContent,
  distance: 50,
  speed: 1 / 15,
});

let afterScrollTimeoutId = null;

const smoothMovement = () => {
  chronometrumSSWheel.init();

  useOn({
    mode: "selector",
    typeEvent: "scroll",
    selector: ".chronometrum-content",
    callback: ({ target }) => {
      const { scrollTop, scrollHeight, clientHeight } = target;
      const percentageOfScroll = Math.floor(
        (scrollTop / (scrollHeight - clientHeight)) * 100
      );

      $chronometrumContent.style.setProperty(
        "--percentage",
        `${percentageOfScroll}`
      );

      clearTimeout(afterScrollTimeoutId);

      afterScrollTimeoutId = setTimeout(() => {
        const goTo = percentageOfScroll > 50 ? 100 : 0;
        chronometrumSSWheel.speed = 1 / 9;
        chronometrumSSWheel.scrollTo(goTo, { type: "percentage" });
        chronometrumSSWheel.speed = 1 / 15;
      }, 200);
    },
  })[0]();

  useOn({
    typeEvent: "touchstart",
    selector: ".chronometrum-content",
    callback: () => {
      chronometrumSSWheel.cancelAnimation();
    },
  });
};

const initChronometrumInterface = () => {
  smoothMovement();
};

export { initChronometrumInterface, chronometrumSSWheel };
