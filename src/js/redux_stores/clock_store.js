import { createStore } from "redux";

import { formatTo12h, formatTo24h } from "../helpers/date_formater.js";

const clockInitialState = {
  formatType: "24h",
  timeToShow: null,
};

const clockReducer = (state = clockInitialState, action) => {
  switch (action.type) {
    case "SET_FORMAT_TO_24":
      return { ...state, formatType: "24h" };

    case "SET_FORMAT_TO_12":
      return { ...state, formatType: "12h" };

    case "UPDATE_TIME":
      const timeToShow =
        state.formatType === "24h"
          ? formatTo24h(new Date())
          : formatTo12h(new Date());
      return { ...state, timeToShow };

    case "UPDATE_TIME_WITHOUT_SEC":
      const timeToShowWithoutSec =
        state.formatType === "24h"
          ? formatTo24h(new Date(), { allowSeconds: false })
          : formatTo12h(new Date(), { allowSeconds: false });
      return { ...state, timeToShow: timeToShowWithoutSec };

    default:
      return state;
  }
};

const clockStore = createStore(
  clockReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export { clockInitialState, clockStore };
