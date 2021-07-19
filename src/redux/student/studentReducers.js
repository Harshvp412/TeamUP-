import studentActionTypes from "./studentActionTypes";
import {
    initialLoginState,
    initialRegisterState,
    initialStudentState,
    initialAvatarState,
    initialCVState,
    initialUpdateState,
} from "./initialStudentStates";
import { saveUserState } from "../loadPersistedState";

export const loginReducer = (state = initialLoginState, action) => {
    switch (action.type) {
        case studentActionTypes.LOGIN_REQUEST:
            return {
                loggingIn: true,
                error: {},
            };
        case studentActionTypes.LOGIN_SUCCESS:
            return {
                loggingIn: false,
                error: {},
            };
        case studentActionTypes.LOGIN_FAILURE:
            return {
                loggingIn: false,
                error: { ...action.payload },
            };
        default:
            return state;
    }
};

export const registerReducer = (state = initialRegisterState, action) => {
    switch (action.type) {
        case studentActionTypes.REGISTER_REQUEST:
            return {
                registering: true,
                error: {},
            };
        case studentActionTypes.REGISTER_SUCCESS:
            return {
                registering: false,
                error: {},
            };
        case studentActionTypes.REGISTER_FAILURE:
            return {
                registering: false,
                error: { ...action.payload },
            };
        default:
            return state;
    }
};

export const cvReducer = (state = initialCVState, action) => {
    switch (action.type) {
        case studentActionTypes.CV_REQUEST:
            return {
                ...state,
                isUploading: true,
            };
        case studentActionTypes.CV_SUCCESS:
            return {
                ...state,
                isUploading: false,
            };
        case studentActionTypes.CV_FAILURE:
            return {
                isUploading: false,
                error: { ...action.payload },
            };
        default:
            return state;
    }
};
export const avatarReducer = (state = initialAvatarState, action) => {
    switch (action.type) {
        case studentActionTypes.AVATAR_REQUEST:
            return {
                ...state,
                isUploading: true,
            };
        case studentActionTypes.AVATAR_SUCCESS:
            return {
                ...state,
                isUploading: false,
            };
        case studentActionTypes.AVATAR_FAILURE:
            return {
                isUploading: false,
                error: { ...action.payload },
            };
        default:
            return state;
    }
};

export const updateInfoReducer = (state = initialUpdateState, action) => {
    switch (action.type) {
        case studentActionTypes.UPDATE_STUDENT_REQUEST:
        case studentActionTypes.UPDATE_PASSWORD_REQUEST:
            return {
                ...state,
                isUpdating: true,
            };

        case studentActionTypes.UPDATE_STUDENT_SUCCESS:
        case studentActionTypes.UPDATE_PASSWORD_SUCCESS:
            return {
                ...state,
                isUpdating: false,
            };

        case studentActionTypes.UPDATE_STUDENT_FAILURE:
        case studentActionTypes.UPDATE_PASSWORD_FAILURE:
            return {
                isUpdating: false,
                error: { ...action.payload },
            };

        default:
            return state;
    }
};

export const studentDataReducer = (state = initialStudentState, action) => {
    switch (action.type) {
        case studentActionTypes.LOGIN_SUCCESS:
            saveUserState(action.payload.data);
            return {
                ...action.payload.data,
            };
        case studentActionTypes.REGISTER_SUCCESS:
            saveUserState(action.payload.data);
            return {
                ...action.payload.data,
            };
        case studentActionTypes.LOGOUT_SUCCESS:
            return initialStudentState;

        case studentActionTypes.AVATAR_SUCCESS:
            let studentDataWithAvatar = { ...state, avatarURL: action.payload };
            saveUserState(studentDataWithAvatar);
            return studentDataWithAvatar;

        case studentActionTypes.CV_SUCCESS:
            let studentDataWithCV = { ...state, cvURL: action.payload, cvUploaded: true };
            saveUserState(studentDataWithCV);
            return studentDataWithCV;

        case studentActionTypes.APPLY_PROJECT_SUCCESS:
            let updatedAppliedProjects = [...state.appliedProjects, action.payload.projectID];
            const updatedState = { ...state, appliedProjects: updatedAppliedProjects };

            saveUserState(updatedState);
            return updatedState;

        case studentActionTypes.UPDATE_STUDENT_SUCCESS:
            let updatedStudentData = { ...state, ...action.payload };
            saveUserState(updatedStudentData);
            return updatedStudentData;
        default:
            return state;
    }
};
