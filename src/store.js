import { createStore } from "redux";
import Messages from "./client/components/Messages/Messages";
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
  if (action.type === "set-token") {
    return {
      ...state,
      token: action.payload
    };
  }
  if (action.type === "set-shippingaddress") {
    let shippingCopy = { ...state.shippingAddress };
    shippingCopy = action.payload;
    return {
      ...state,
      shippingAddress: shippingCopy
    };
  }
  if (action.type === "set-order") {
    return {
      ...state,
      order: action.payload
    };
  }
  if (action.type === "clear-shoppinglist") {
    return {
      ...state,
      cart: null
    };
  }
  if (action.type === "set-video") {
    return {
      ...state,
      videosave: action.content
    };
  }
  if (action.type === "create-room") {
    return {
      ...state,
      msgs: [...state.msgs, { room: action.room, msgs: [] }]
    };
  }
  if (action.type === "set-messages") {
    return {
      ...state,
      msgs: state.msgs.map(msg =>
        msg.room === action.room ? { ...msg, msgs: action.content } : msg
      )
    };
  }
  if (action.type === "add-message") {
    return {
      ...state,
      msgs: state.msgs.map(msg =>
        msg.room === action.room
          ? { ...msg, msgs: [...msg.msgs, action.content] }
          : msg
      )
    };
  }
  if (action.type === "clear-message") {
    return {
      ...state,
      msgs: state.msgs.map(msg =>
        msg.room === action.room ? { ...msg, msgs: [] } : msg
      )
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
    user: null,
    searchQuery: "",
    msgs: [],
    shippingAddress: null,
    token: null,
    order: null,
    videosave: ""
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
