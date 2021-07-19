import { combineReducers } from "redux";
import { projectDataReducer } from "./projects/projectReducer";
import {
    cvReducer,
    avatarReducer,
    loginReducer,
    registerReducer,
    studentDataReducer,
    updateInfoReducer,
} from "./student/studentReducers";

const uploadReducer = combineReducers({
    cvState: cvReducer,
    avatarState: avatarReducer,
});

const studentReducer = combineReducers({
    data: studentDataReducer,
    uploadState: uploadReducer,
    updateInfoState: updateInfoReducer,
});

const rootReducer = combineReducers({
    loginData: loginReducer,
    registerData: registerReducer,
    student: studentReducer,
    projects: projectDataReducer,
});

export default rootReducer;
