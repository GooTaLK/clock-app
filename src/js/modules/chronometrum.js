import { getTimeUnits } from "../helpers/chrono";
import { addCeroAhead } from "../helpers/date_formater";
import useOn from "../helpers/use_on";
import { chronometrumSSWheel } from "./chronometrum_interface";

const $ = (selector) => document.querySelector(selector);

const $chronometrumTime = $(".chronometrum__time");
const $chronometrumLog = $(".chronometrum__log");
const $chronometrumBall = $(".chronometrum__ball");
const $chronometrumState = $(".chronometrum-state");
const $laps = $(".laps");
const $playPauseButton = $("button[data-chronometrum-button='play/pause']");
const $playPauseImg = $("button[data-chronometrum-button='play/pause'] img");
const $playPauseLabel = $("[data-chronometrum-button='play/pause'] + span");
const $restartButton = $("button[data-chronometrum-button='reset']");
const $lapButton = $("button[data-chronometrum-button='lap']");

const PLAY_SVG_PATH = "./assets/Play.svg";
const PAUSE_SVG_PATH = "./assets/Pause.svg";

const chronometrumState = {
  running: false,
  state: null,
  time: 0,
  laps: [],
  cancelIntervalId: null,
};

const getTimeText = (timeInMs) => {
  const { miliseconds, seconds, minutes, hours } = getTimeUnits(timeInMs);
  return hours > 0
    ? `${addCeroAhead(hours)}:${addCeroAhead(minutes)}:${addCeroAhead(seconds)}`
    : `${addCeroAhead(minutes)}:${addCeroAhead(seconds)}:${addCeroAhead(
        Math.floor(miliseconds / 10)
      )}`;
};

const playChronometrum = () => {
  chronometrumState.cancelIntervalId = setInterval(() => {
    chronometrumState.time += 10;
    const lastLap =
      chronometrumState.laps.length !== 0 ? chronometrumState.laps.at(-1) : 0;
    const timeText = getTimeText(chronometrumState.time);
    const logText = getTimeText(chronometrumState.time - lastLap);

    $chronometrumTime.textContent = timeText;
    $chronometrumLog.textContent = logText;
  }, 10);

  $playPauseLabel.textContent = "Pause";
  $playPauseImg.src = PAUSE_SVG_PATH;
  $lapButton.disabled = false;

  chronometrumState.state = "play";

  if (!chronometrumState.running) {
    $chronometrumBall.classList.add("chronometrum__ball--anim");
    $restartButton.disabled = false;
    $chronometrumState.textContent = "Time";

    chronometrumState.running = true;
    return;
  }

  $chronometrumBall.style.animationPlayState = "running";
};

const pauseChronometrum = () => {
  clearInterval(chronometrumState.cancelIntervalId);

  $chronometrumBall.style.animationPlayState = "paused";
  $playPauseLabel.textContent = "Continue";
  $playPauseImg.src = PLAY_SVG_PATH;
  $lapButton.disabled = true;

  chronometrumState.state = "pause";
};

const initChronometrumListeners = () => {
  useOn({
    typeEvent: "click",
    selector: "button[data-chronometrum-button='play/pause']",
    callback: () => {
      if (
        chronometrumState.state === null ||
        chronometrumState.state === "pause"
      )
        return playChronometrum();

      if ((chronometrumState.state = "play")) pauseChronometrum();
    },
  });

  useOn({
    typeEvent: "click",
    selector: "button[data-chronometrum-button='lap']",
    callback: () => {
      const timeLoged = chronometrumState.time;
      const lapText = getTimeText(timeLoged);

      const $lap = document.createElement("p");
      $lap.classList.add("lap");
      $lap.textContent = lapText;

      $laps.insertAdjacentElement('afterbegin', $lap);
      chronometrumState.laps.push(timeLoged);

      chronometrumSSWheel.scrollTo(100, { type: "percentage" });
    },
  });

  useOn({
    typeEvent: "click",
    selector: "button[data-chronometrum-button='reset']",
    callback: () => {
      clearInterval(chronometrumState.cancelIntervalId);

      chronometrumState.running = false;
      chronometrumState.state = null;
      chronometrumState.time = 0;
      chronometrumState.laps.splice(0);

      $chronometrumTime.textContent = "00:00:00";
      $chronometrumLog.textContent = "00:00:00";
      $chronometrumBall.classList.remove("chronometrum__ball--anim");
      $chronometrumBall.removeAttribute("style");
      $chronometrumState.textContent = "Ready";
      $laps.innerHTML = "";
      $playPauseButton.classList.remove("running");
      $playPauseImg.src = PLAY_SVG_PATH;
      $playPauseLabel.textContent = "Start";
      $restartButton.disabled = true;
      $lapButton.disabled = true;

      chronometrumSSWheel.scrollTo(0);
    },
  });
};

export { initChronometrumListeners, chronometrumState };
