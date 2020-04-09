import { createStore } from "redux";
let reducer = (state, action) => {
  if (action.type === "login-success") {
    return {
      ...state,
      loggedIn: true,
      user: action.content,
      userId: action.content._id
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
  if (action.type === "set-liveselled") {
    return {
      ...state,
      liveselled: action.content
    };
  }
  if (action.type === "set-stream") {
    return {
      ...state,
      streamlive: action.content
    };
  }
  if (action.type === "set-streamview") {
    return {
      ...state,
      streamview: action.content
    };
  }
  if (action.type === "clear-stream") {
    return {
      ...state,
      streamlive: null
    };
  }
  if (action.type === "set-selected") {
    return {
      ...state,
      selected: action.content
    };
  }
  if (action.type === "set-cart") {
    return {
      ...state,
      cart: action.content
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
    stream_key: "",
    items: [],
    shoppingList: [],
    cart: null,
    selected: [],
    liveselled: [],
    streamlive: null,
    streamview: null,
    user: null,
    searchQuery: "",
    msgs: [],
    shippingAddress: null,
    token: null,
    order: null
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
