import defaultRing from "../../data/timer/default_ring.json";

import useOn from "../helpers/use_on";
import arcTanOfAllQuadrants from "../helpers/getAngleFromCoordinates";
import { getTimeUnits, msOf } from "../helpers/chrono";
import { addCeroAhead } from "../helpers/date_formater";
import IS_MOBILE from "../helpers/detect_device";
import { secondModal } from "./modal";
import CaSecondModal from "../dom_elements/modal/CaSecondModal";

const $ball = document.querySelector(".timer__ball");
const $animTopBall = document.querySelector(".timer__animated-top-ball");
const $animBottomBall = document.querySelector(".timer__animated-bottom-ball");
const $count = document.querySelector(".timer__count");
const $state = document.querySelector(".timer-state");
const $playPauseButton = document.querySelector(
  "button[data-timer-button='play/pause']"
);
const $playPauseImg = document.querySelector(
  "button[data-timer-button='play/pause'] img"
);
const $playPauseLabel = document.querySelector(
  "button[data-timer-button='play/pause'] + span"
);
const $restartButton = document.querySelector(
  "button[data-timer-button='reset']"
);
const $ringButton = document.querySelector("button[data-timer-button='ring']");

const THIRTY_MINUTES_IN_MS = 30 * msOf.MINUTE;

const MOVE_EVENT = IS_MOBILE ? "touchmove" : "mousemove";
const DOWN_EVENT = IS_MOBILE ? "touchstart" : "mousedown";
const UP_EVENT = IS_MOBILE ? "touchend" : "mouseup";

const timerState = {
  ballOriginX: 0,
  ballOriginY: 0,
  pointerX: 0,
  pointerY: 0,
  moveBallLocked: false,
  prevAngleLog: 0,
  rounds: 0,
  time: 0,
  ring: defaultRing,
  intervalId: null,
  running: false,
  state: null,
};

const setTimerRing = (ring) => {
  timerState.ring = ring;
  localStorage.setItem("timer-ring", ring);
};

const correctAngleOfBall = (angleInRad) => {
  if (angleInRad < -(Math.PI / 2)) {
    angleInRad += Math.PI * 2;
  }

  angleInRad += Math.PI / 2;

  return angleInRad;
};

const logRound = (currentAngle) => {
  if (
    currentAngle < Math.PI / 2 &&
    timerState.prevAngleLog < Math.PI * 2 &&
    timerState.prevAngleLog > (Math.PI * 3) / 2
  )
    timerState.rounds++;

  if (
    timerState.prevAngleLog < Math.PI / 2 &&
    currentAngle < Math.PI * 2 &&
    currentAngle > (Math.PI * 3) / 2
  )
    timerState.rounds--;

  if (timerState.rounds < 0) timerState.rounds = 0;
};

const lockMoveOfTheBall = (currentAngle) => {
  if (timerState.moveBallLocked === true && currentAngle < Math.PI)
    timerState.moveBallLocked = false;
  else if (
    timerState.prevAngleLog < Math.PI / 2 &&
    currentAngle < Math.PI * 2 &&
    currentAngle > (Math.PI * 3) / 2
  ) {
    timerState.moveBallLocked = true;
    $ball.style.setProperty("--angle", "0rad");
  }
};

const moveBallAnimation = (angleInRad) => {
  if (timerState.rounds === 0) lockMoveOfTheBall(angleInRad);
  if (timerState.moveBallLocked) return;

  $ball.style.setProperty("--angle", `${angleInRad}rad`);
};

const writteTimerValue = (angleInRad) => {
  if (timerState.moveBallLocked) {
    $count.textContent = "00:00";
    timerState.time = 0;
    return;
  }

  if (angleInRad !== undefined)
    timerState.time =
      (THIRTY_MINUTES_IN_MS * angleInRad) / (Math.PI * 2) +
      THIRTY_MINUTES_IN_MS * timerState.rounds;

  const { seconds, minutes, hours } = getTimeUnits(timerState.time);
  const timerCount =
    hours === 0
      ? `${addCeroAhead(minutes)}:${addCeroAhead(seconds)}`
      : `${addCeroAhead(hours)}:${addCeroAhead(minutes)}:${addCeroAhead(
          seconds
        )}`;

  hours !== 0
    ? $count.classList.add("timer__count--large")
    : $count.classList.remove("timer__count--large");

  $count.textContent = timerCount;
};

const moveBall = () => {
  useOn({
    typeEvent: DOWN_EVENT,
    selector: ".timer__ball",
    callback: () => {
      $ball.classList.add("timer__ball--dragging");
      document.documentElement.style.cursor = "grabbing";
    },
  });

  useOn({
    typeEvent: UP_EVENT,
    callback: () => {
      if (!$ball.classList.contains("timer__ball--dragging")) return;
      $ball.classList.remove("timer__ball--dragging");
      document.documentElement.style.removeProperty("cursor");

      if (timerState.time !== 0) {
        $playPauseButton.disabled = false;
        $restartButton.disabled = false;
        $ringButton.disabled = true;
      } else {
        $playPauseButton.disabled = true;
        $restartButton.disabled = true;
        $ringButton.disabled = false;
      }
    },
  });

  useOn({
    typeEvent: MOVE_EVENT,
    callback: (e) => {
      if (!$ball.classList.contains("timer__ball--dragging")) return;
      e.preventDefault();

      timerState.ballOriginX = $ball.offsetLeft;
      timerState.ballOriginY = $ball.offsetTop;
      timerState.pointerX = IS_MOBILE ? e.touches[0].pageX : e.pageX;
      timerState.pointerY =
        (IS_MOBILE ? e.touches[0].pageY : e.pageY) - visualViewport.height;

      const slopeAngleRad = arcTanOfAllQuadrants({
        coordinates: { x: timerState.pointerX, y: timerState.pointerY },
        origin: { x: timerState.ballOriginX, y: timerState.ballOriginY },
      });
      const angleRad = correctAngleOfBall(slopeAngleRad);

      moveBallAnimation(angleRad);
      writteTimerValue(angleRad);

      logRound(angleRad);
      timerState.moveBallLocked
        ? (timerState.prevAngleLog = 0)
        : (timerState.prevAngleLog = angleRad);
    },
    options: IS_MOBILE ? { passive: false } : false,
  });
};

const alertModal = () => {
  secondModal.open({
    children: CaSecondModal({
      title: "Timer over",
      content: {
        type: "html",
        html: `
          <div class="timer_audio-content">
            <audio
              autoplay
              src="assets/${timerState.ring
                .toLowerCase()
                .replaceAll(" ", "-")}.mp3"
            >
              Your Browser does not support the <code>audio</code> element.
            </audio>
          </div>
        `,
      },
      buttons: [{ text: "Ok", dataset: "close" }],
    }),
    animation: "opacity1",
  });
};

const playTimer = () => {
  timerState.intervalId = setInterval(() => {
    if (timerState.time < 1000) {
      resetTimer();
      alertModal();
      return;
    }

    timerState.time -= msOf.SECOND;
    writteTimerValue();
  }, 1000);

  $state.textContent = "Running";

  $playPauseImg.src = "assets/Pause.svg";
  $playPauseLabel.textContent = "Pause";

  timerState.state = "play";

  if (!timerState.running) {
    $ball.style.visibility = "hidden";
    $animTopBall.classList.add("timer__animated-top-ball--anim");
    $animBottomBall.classList.add("timer__animated-bottom-ball--anim");

    timerState.running = true;
    return;
  }

  $animTopBall.style.animationPlayState = "running";
  $animBottomBall.style.animationPlayState = "running";
};

const pauseTimer = () => {
  clearInterval(timerState.intervalId);

  $state.textContent = "Paused";

  $playPauseImg.src = "assets/Play.svg";
  $playPauseLabel.textContent = "Continue";

  $animBottomBall.style.animationPlayState = "paused";
  $animTopBall.style.animationPlayState = "paused";

  timerState.state = "pause";
};

const resetTimer = () => {
  clearInterval(timerState.intervalId);

  $state.textContent = "Drag the red ball";

  $playPauseButton.disabled = true;
  $restartButton.disabled = true;
  $ringButton.disabled = false;

  $playPauseImg.src = "assets/Play.svg";
  $playPauseLabel.textContent = "Start";

  $animTopBall.classList.remove("timer__animated-top-ball--anim");
  $animBottomBall.classList.remove("timer__animated-bottom-ball--anim");
  $ball.removeAttribute("style");
  $animTopBall.removeAttribute("style");
  $animBottomBall.removeAttribute("style");

  timerState.running = false;
  timerState.state = null;
  timerState.time = 0;
  timerState.rounds = 0;
  writteTimerValue();
};

const timerButtons = () => {
  useOn({
    typeEvent: "click",
    selector: "button[data-timer-button='play/pause']",
    callback: () => {
      if (timerState.state === null || timerState.state === "pause")
        return playTimer();
      if (timerState.state === "play") pauseTimer();
    },
  });

  useOn({
    typeEvent: "click",
    selector: "button[data-timer-button='reset']",
    callback: resetTimer,
  });
};

const initTimerListeners = () => {
  moveBall();
  timerButtons();
};

const initTimerRing = () => {
  const ring = localStorage.getItem("timer-ring");
  if (!ring) return;

  setTimerRing(ring);
};

export { initTimerListeners, initTimerRing, setTimerRing, timerState };
