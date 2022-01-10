// week: 604800000,
// day: 86400000,
// hour: 3600000,
// minute: 60000,
// second: 1000,

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

const msOf = {
  SECOND,
  MINUTE,
  HOUR,
  DAY,
  WEEK,
};

const getTimeUnits = (timeInMs) => {
  const miliseconds = Math.floor(timeInMs % SECOND);
  const seconds = Math.floor((timeInMs % MINUTE) / SECOND);
  const minutes = Math.floor((timeInMs % HOUR) / MINUTE);
  const hours = Math.floor((timeInMs % DAY) / HOUR);
  const days = Math.floor((timeInMs % WEEK) / DAY);
  const weeks = Math.floor(timeInMs / WEEK);

  return {
    weeks,
    days,
    hours,
    minutes,
    seconds,
    miliseconds,
  };
};

export { getTimeUnits, msOf };
