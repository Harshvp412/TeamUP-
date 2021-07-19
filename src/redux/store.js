import { applyMiddleware, createStore, compose } from "redux";
import thunk from "redux-thunk";
import { loadPersistedState } from "./loadPersistedState";

import rootReducer from "./rootReducer";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistedState = loadPersistedState();

const store = createStore(rootReducer, persistedState, composeEnhancers(applyMiddleware(thunk)));

export default store;
