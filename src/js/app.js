import {
  initAlarmInterface,
  initAlarmListeners,
} from "./modules/alarm_interface.js";
import { initAlarmEditModal, initAlarmSettingsModal } from "./modules/modal.js";
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
  initHeaderBackground();
  initClockDisplay();
  initClockSettings();
  initAlarmInterface();
  initAlarmListeners();
  initAlarmEditModal();
  initAlarmSettingsModal();

  headerMenu();
  changeBackgroundBtn();
  clockSettings();
  navBtns();
};

export default app;
