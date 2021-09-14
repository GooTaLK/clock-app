import backgroundData from "../../data/background_imgs.json";

import useOn from "../helpers/use_on";
import Figure from "./dom_elements/Figure";

const $header = document.querySelector(".header");
const $headerOptionBtn = document.querySelector(".header__options-btn");
const $headerOptionMenu = document.querySelector(".header__options-menu");
const $menuHamburgerIcon = document.querySelector(".lki-three_bars");
const $changeBackgroundBtn = document.querySelector(".change-background-btn");
const $chevronIcon = document.querySelector(".lki-chevron_down");

const setBackgroundImageWithAnId = (dataImgId) => {
  const matchingData = backgroundData.filter(
    ({ id }) => id === Number(dataImgId)
  );
  $header.style.setProperty(
    "background-image",
    `url(${matchingData[0].imgSrc})`
  );

  return matchingData;
};

const initHeaderBackground = () => {
  const bgImgId = localStorage.getItem("background-img-id");
  if (!bgImgId) return;

  setBackgroundImageWithAnId(bgImgId);
};

const headerMenu = () => {
  useOn({
    typeEvent: "click",
    selector: ".header__options-btn",
    callback: () => {
      $headerOptionBtn.classList.toggle("header__options-btn--active");
      $headerOptionMenu.classList.toggle("header__options-menu--active");
      $menuHamburgerIcon.classList.toggle("lki-three_bars--close");
    },
    callbackIfNotMatch: ({ target }) => {
      const isMenuActive = $headerOptionMenu.classList.contains(
        "header__options-menu--active"
      );
      const clickInMenu = target.matches(".header__menu *");

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

        $changeBackgroundBtn.after($bgSlider);

        setTimeout(() => $bgSlider.classList.add("lk-slider--active"), 0);

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

      const matchingData = setBackgroundImageWithAnId(dataImgId);
      localStorage.setItem("background-img-id", matchingData[0].id);
    },
  });
};

export { initHeaderBackground, headerMenu, changeBackgroundBtn };
