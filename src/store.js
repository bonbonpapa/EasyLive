import { createStore } from "redux";
let reducer = (state, action) => {
  if (action.type === "set-items") {
    return { ...state, items: action.content };
  }
  if (action.type === "set-messages") {
    return { ...state, msgs: action.messages };
  }
  return state;
};

const store = createStore(
  reducer,
  {
    items: [],
    msgs: []
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
