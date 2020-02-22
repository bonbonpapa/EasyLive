import { createStore } from "redux";
let reducer = (state, action) => {
  if (action.type === "set-items") {
    return { ...state, items: action.content };
  }
  return state;
};

const store = createStore(
  reducer,
  {
    items: []
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
