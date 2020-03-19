import { createStore } from "redux";
let reducer = (state, action) => {
  if (action.type === "login-success") {
    return {
      ...state,
      loggedIn: true,
      username: action.content
    };
  }
  if (action.type === "set-items") {
    return { ...state, items: action.content };
  }
  if (action.type === "set-messages") {
    return { ...state, msgs: action.messages };
  }
  if (action.type === "log-out") {
    return {
      ...state,
      loggedIn: false,
      username: undefined,
      userId: undefined
    };
  }
  if (action.type === "set-key") {
    return {
      ...state,
      stream_key: action.content
    };
  }
  if (action.type === "set-liveid") {
    return {
      ...state,
      live_id: action.content
    };
  }
  if (action.type === "set-liveselled") {
    return {
      ...state,
      liveselled: action.content
    };
  }
  return state;
};

const store = createStore(
  reducer,
  {
    loggedIn: false,
    username: undefined,
    userId: undefined,
    live_id: undefined,
    stream_key: "",
    items: [],
    liveselled: [],
    msgs: []
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
