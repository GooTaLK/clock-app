import { initAlarmInterface } from "./modules/alarm_interface.js";
import initModals from "./modules/modal.js";
import {
  initClockAndAlarm,
  initClockFormat,
  clockSettings,
} from "./modules/clock.js";
import {
  initHeaderBackground,
  headerMenu,
  changeBackgroundBtn,
} from "./modules/header_funtionalities";
import { navBtns } from "./modules/nav_interactions";
import "./modules/input_range";
import { initAlarmListeners } from "./modules/alarm.js";

const app = () => {
  initHeaderBackground();
  initClockFormat();
  initClockAndAlarm();
  initAlarmInterface();
  initAlarmListeners();
  initModals();

  headerMenu();
  changeBackgroundBtn();
  clockSettings();
  navBtns();
};

export default app;
