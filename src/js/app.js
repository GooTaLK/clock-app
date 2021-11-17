import {
  initHeaderBackground,
  headerMenu,
  changeBackgroundBtn,
  switchClockFormat,
} from "./modules/header_funtionalities";
import { navBtns } from "./modules/nav_interactions";
import { initClockAndAlarm, initClockFormat } from "./modules/clock.js";
import { initAlarmInterface } from "./modules/alarm_interface.js";
import { initAlarmListeners } from "./modules/alarm.js";
import initModals from "./modules/modal.js";

import "./modules/input_range";

const app = () => {
  initHeaderBackground();
  initClockFormat();
  initClockAndAlarm();
  initAlarmInterface();
  initAlarmListeners();
  initModals();

  headerMenu();
  changeBackgroundBtn();
  navBtns();
  switchClockFormat();
};

export default app;
