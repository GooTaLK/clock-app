import useOn from "../helpers/use_on";

const $headerOptionBtn = document.querySelector(".header__options-btn");
const $headerOptionMenu = document.querySelector(".header__options-menu");
const $menuHamburgerIcon = document.querySelector(".lki-three_bars");

const headerMenu = () => {
  useOn(
    "click",
    ".header__options-btn",
    () => {
      $headerOptionBtn.classList.toggle("header__options-btn--active");
      $headerOptionMenu.classList.toggle("header__options-menu--active");
      $menuHamburgerIcon.classList.toggle("lki-three_bars--close");
    },
    (e) => {
      const isMenuActive = $headerOptionMenu.classList.contains(
        "header__options-menu--active"
      );
      const clickInMenu = e.target.matches(".header__menu *");

      if (!isMenuActive || clickInMenu) return;

      $headerOptionBtn.classList.remove("header__options-btn--active");
      $headerOptionMenu.classList.remove("header__options-menu--active");
      $menuHamburgerIcon.classList.remove("lki-three_bars--close");
    }
  );
};

export { headerMenu };
