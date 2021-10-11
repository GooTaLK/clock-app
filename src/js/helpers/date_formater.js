const getTimeFromDate = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return [hours, minutes, seconds];
};

const addCeroAhead = (number) => (number < 10 ? "0" + number : number);

const formatDate = (timeFromDate, fullOptions, hoursWithCeroAhead = false) => {
  const { allowHours, allowMinutes, allowSeconds } = fullOptions;
  let [hours, minutes, seconds] = timeFromDate;
  const timeArray = [];

  hoursWithCeroAhead && (hours = addCeroAhead(hours));
  minutes = addCeroAhead(minutes);
  seconds = addCeroAhead(seconds);

  allowHours && timeArray.push(hours);
  allowMinutes && timeArray.push(minutes);
  allowSeconds && timeArray.push(seconds);

  const dateFormated = timeArray.join(":");

  return dateFormated;
};

const formatTo24h = (
  date,
  options = { allowHours: true, allowMinutes: true, allowSeconds: true }
) => {
  const fullOptions = {
    allowHours: true,
    allowMinutes: true,
    allowSeconds: true,
    ...options,
  };
  let timeFromDate = getTimeFromDate(date);

  const dateFormated = formatDate(timeFromDate, fullOptions);

  return dateFormated;
};

const formatTo12h = (
  date,
  options = {
    allowHours: true,
    allowMinutes: true,
    allowSeconds: true,
    allowMeridium: true,
  }
) => {
  const fullOptions = {
    allowHours: true,
    allowMinutes: true,
    allowSeconds: true,
    allowMeridium: true,
    ...options,
  };
  const { allowMeridium } = fullOptions;
  let [hours, minutes, seconds] = getTimeFromDate(date);
  const isPostMeridium = hours > 12;

  const meridium = isPostMeridium || hours === 12 ? "pm" : "am";
  hours = isPostMeridium ? hours - 12 : hours;

  const dateFormated = formatDate([hours, minutes, seconds], fullOptions);
  const dateFormatedMeridium = dateFormated + " " + meridium;

  return allowMeridium ? dateFormatedMeridium : dateFormated;
};

export { formatTo24h, formatTo12h, getTimeFromDate, addCeroAhead };
