import { initHeader } from "./modules/header_funtionalities";
import { navButtons } from "./modules/nav_interactions";
import {
  initClockAndAlarm,
  initClockFormat,
  initSecondaryClocks,
} from "./modules/clock.js";
import { initClockInterface } from "./modules/clock_interface";
import { initAlarmInterface } from "./modules/alarm_interface.js";
import { initAlarmListeners } from "./modules/alarm.js";
import initModals from "./modules/modal.js";

import "./modules/input_range";

const app = () => {
  initHeader();
  navButtons();
  initClockInterface();
  initAlarmInterface();
  initClockFormat();
  initClockAndAlarm();
  initSecondaryClocks();
  initAlarmListeners();
  initModals();
};

export default app;
