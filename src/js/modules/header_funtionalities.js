import backgroundData from "../../data/background_imgs.json";

import useOn from "../helpers/use_on";
import Figure from "./ui_components/Figure";

const $header = document.querySelector(".header");
const $headerOptionBtn = document.querySelector(".header__options-btn");
const $headerOptionMenu = document.querySelector(".header__options-menu");
const $menuHamburgerIcon = document.querySelector(".lki-three_bars");
const $changeBackgroundBtn = document.querySelector(".change-background-btn");
const $chevronIcon = document.querySelector(".lki-chevron_down");

const headerMenu = () => {
  useOn({
    typeEvent: "click",
    selector: ".header__options-btn",
    callback: () => {
      $headerOptionBtn.classList.toggle("header__options-btn--active");
      $headerOptionMenu.classList.toggle("header__options-menu--active");
      $menuHamburgerIcon.classList.toggle("lki-three_bars--close");
    },
    callbackIfNotMatch: (e) => {
      const isMenuActive = $headerOptionMenu.classList.contains(
        "header__options-menu--active"
      );
      const clickInMenu = e.target.matches(".header__menu *");

      if (!isMenuActive || clickInMenu) return;

      $headerOptionBtn.classList.remove("header__options-btn--active");
      $headerOptionMenu.classList.remove("header__options-menu--active");
      $menuHamburgerIcon.classList.remove("lki-three_bars--close");
    },
  });
};

const changeBackgroundBtn = () => {
  useOn({
    typeEvent: "click",
    selector: ".change-background-btn",
    callback: () => {
      const isCharged = $changeBackgroundBtn.classList.contains(
        "change-background-btn--charged"
      );

      if (!isCharged) {
        $changeBackgroundBtn.classList.add("change-background-btn--charged");
        $changeBackgroundBtn.classList.add("change-background-btn--active");
        $chevronIcon.classList.add("lki-chevron_down--up");

        const $bgSlider = document.createElement("div");

        $bgSlider.classList.add("lk-slider");
        $bgSlider.classList.add("background-slider");
        $changeBackgroundBtn.after($bgSlider);

        backgroundData.forEach((data) => {
          $bgSlider.appendChild(
            Figure({
              containerClass: "lk-slider_card",
              imgSrc: data.imgSrc,
              imgAlt: data.imgAlt,
              figcaptionText: data.figcaptionText,
              id: data.id,
            })
          );
        });

        setTimeout(() => $bgSlider.classList.add("lk-slider--active"), 10);

        return;
      }

      const $bgSlider = document.querySelector(".background-slider");

      $changeBackgroundBtn.classList.toggle("change-background-btn--active");
      $chevronIcon.classList.toggle("lki-chevron_down--up");
      $bgSlider.classList.toggle("lk-slider--active");
    },
  });

  useOn({
    typeEvent: "click",
    selector: ".lk-slider_card",
    callback: ({ target }) => {
      const dataImgId = target.dataset.imgId;

      if (!dataImgId) return;

      const matchingData = backgroundData.filter(
        ({ id }) => id === Number(dataImgId)
      );
      $header.style.setProperty(
        "background-image",
        `url(${matchingData[0].imgSrc})`
      );
    },
  });
};

export { headerMenu, changeBackgroundBtn };
