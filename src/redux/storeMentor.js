import { applyMiddleware, createStore, compose } from "redux";
import thunk from "redux-thunk";
import { loadPersistedMentorState } from "./loadPersistedStateMentor";
import rootReducerMentor from "./rootReducerMentor";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistedStateMentor = loadPersistedMentorState();

const store = createStore(rootReducerMentor, persistedStateMentor, composeEnhancers(applyMiddleware(thunk)));

export default store;
