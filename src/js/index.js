// Import of main css
import "../css/styles.css";

// Import of images in the index.html
import "../assets/images/GitHub-Mark-32px.png";

// Init and more...
import { initClockDisplay, clockSettings } from "./modules/clock.js";
import { headerMenu } from "./modules/header_funtionalities";

initClockDisplay();
clockSettings();
headerMenu();

// document.addEventListener("DOMContentLoaded", () => {
// });
