// Init and more...
import { applyMiddleware } from "redux";
import {
  initClockDisplay,
  initClockSettings,
  clockSettings,
} from "./modules/clock.js";
import {
  initHeaderBackground,
  headerMenu,
  changeBackgroundBtn,
} from "./modules/header_funtionalities";
import { navBtns } from "./modules/nav_interactions";

const app = () => {
  initClockSettings();
  initClockDisplay();
  clockSettings();

  initHeaderBackground();
  headerMenu();
  changeBackgroundBtn();

  navBtns();
};

// document.addEventListener("DOMContentLoaded", () => {
// });

export default app;
