import { combineReducers } from "redux";

import { loginReducer, mentorDataReducer, updateInfoReducer } from "./mentor/mentorReducers";
import { avatarReducer } from "./mentor/mentorReducers";

const mentor = combineReducers({
    data: mentorDataReducer,
    updateInfoState: updateInfoReducer,
    avatarState: avatarReducer
});

const rootReducerMentor = combineReducers({
    loginData: loginReducer,
    mentor,

});

export default rootReducerMentor;
