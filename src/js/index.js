// Import of main css
import "../css/styles.css";

// Import of images in the index.html
import "../assets/images/GitHub-Mark-32px.png";
import "../assets/images/background_imgs/min_resolution/forest-5855196_640.jpg";
import "../assets/images/background_imgs/min_resolution/halloween-2837936_640-compr.png";
import "../assets/images/background_imgs/min_resolution/halloween-5596921_640.jpg";
import "../assets/images/background_imgs/min_resolution/landscape-4258253_640-compr.jpg";
import "../assets/images/background_imgs/min_resolution/mountains-1112911_640.jpg";
import "../assets/images/background_imgs/min_resolution/mountains-3324569_640-compr.jpg";
import "../assets/images/background_imgs/min_resolution/night-3078326_640-compr.jpg";
import "../assets/images/background_imgs/min_resolution/snowflake-1065155_640-compr.jpg";
import "../assets/images/background_imgs/min_resolution/trees-4741364_640-compr.png";

// Init and more...
import { initClockDisplay, clockSettings } from "./modules/clock.js";
import {
  headerMenu,
  changeBackgroundBtn,
} from "./modules/header_funtionalities";

initClockDisplay();
clockSettings();
headerMenu();
changeBackgroundBtn();

// document.addEventListener("DOMContentLoaded", () => {
// });
