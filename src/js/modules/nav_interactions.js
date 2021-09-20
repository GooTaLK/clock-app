import useOn from "../helpers/use_on";

const $container = document.querySelector(".tools-container");
const $anchorsInNav = document.querySelectorAll(".topbar__nav a");

const navBtns = () => {
  useOn({
    typeEvent: "click",
    selector: ".topbar__nav a",
    callback: ({ target }) => {
      const dataToolLevel = target.dataset.toolLevel;
      if (!dataToolLevel) return;

      const translateX = -100 * (dataToolLevel - 1);

      $container.style.setProperty("transform", `translateX(${translateX}vw)`);
      $anchorsInNav.forEach((a) => a.classList.remove("in-screen"));
      target.classList.add("in-screen");
    },
  });
};

export { navBtns };
