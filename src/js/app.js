import { initHeader } from "./modules/header_funtionalities";
import { navButtons } from "./modules/nav_interactions";
import { initClockInterface } from "./modules/clock_interface";
import { initAlarmInterface } from "./modules/alarm_interface";
import { initChronometrumInterface } from "./modules/chronometrum_interface";
import {
  initClockAndAlarm,
  initClockFormat,
  initSecondaryClocks,
} from "./modules/clock.js";
import { initAlarmListeners } from "./modules/alarm.js";
import initModals from "./modules/modal.js";

import "./modules/input_range";

const app = () => {
  initHeader();
  navButtons();
  initClockInterface();
  initAlarmInterface();
  initChronometrumInterface();
  initClockFormat();
  initClockAndAlarm();
  initSecondaryClocks();
  initAlarmListeners();
  initModals();
};

export default app;
