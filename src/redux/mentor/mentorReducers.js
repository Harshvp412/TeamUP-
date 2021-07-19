import mentorActionTypes from "./mentorActionTypes";
import { initialLoginState, initialMentorState, } from "./initialMentorState";
import { saveMentorState } from "../loadPersistedStateMentor";


export const loginReducer = (state = initialLoginState, action) => {
    switch (action.type) {
        case mentorActionTypes.LOGIN_REQUEST:
            return {
                loggingIn: true,
                error: {},
            };
        case mentorActionTypes.LOGIN_SUCCESS:
            return {
                loggingIn: false,
                error: {},
            };
        case mentorActionTypes.LOGIN_FAILURE:
            return {
                loggingIn: false,
                error: { ...action.payload },
            };
        default:
            return state;
    }
};

export const mentorDataReducer = (state = initialMentorState, action) => {
    switch (action.type) {
        case mentorActionTypes.LOGIN_SUCCESS:
            saveMentorState(action.payload);
            return {
                ...action.payload,
            };

        case mentorActionTypes.LOGOUT_SUCCESS:
            return initialMentorState;

        case mentorActionTypes.SELECT_STUDENT_SUCCESS: {
            const updatedStudent = {
                ...state.projects
                    .filter((project) => project.projectID === action.payload.projectCode)[0]
                    .appliedStudents.filter((student) => student.studentID === action.payload.studentCode)[0],
                status: "selected",
            };
            const updatedStudents = [
                ...state.projects
                    .filter((project) => project.projectID === action.payload.projectCode)[0]
                    .appliedStudents.filter((student) => student.studentID !== action.payload.studentCode),
                updatedStudent,
            ];
            const updatedProject = {
                ...state.projects.filter((project) => project.projectID === action.payload.projectCode)[0],
                appliedStudents: updatedStudents,
            };
            const updatedProjects = [
                ...state.projects.filter((project) => project.projectID !== action.payload.projectCode),
                updatedProject,
            ];
            const updatedState = { ...state, projects: updatedProjects };

            saveMentorState(updatedState);
            return updatedState;
        }

        case mentorActionTypes.SHORTLIST_STUDENT_SUCCESS: {
            const updatedStudent = {
                ...state.projects
                    .filter((project) => project.projectID === action.payload.projectCode)[0]
                    .appliedStudents.filter((student) => student.studentID === action.payload.studentCode)[0],
                status: "shortlisted",
            };
            const updatedStudents = [
                ...state.projects
                    .filter((project) => project.projectID === action.payload.projectCode)[0]
                    .appliedStudents.filter((student) => student.studentID !== action.payload.studentCode),
                updatedStudent,
            ];
            const updatedProject = {
                ...state.projects.filter((project) => project.projectID === action.payload.projectCode)[0],
                appliedStudents: updatedStudents,
            };
            const updatedProjects = [
                ...state.projects.filter((project) => project.projectID !== action.payload.projectCode),
                updatedProject,
            ];
            const updatedState = { ...state, projects: updatedProjects };

            saveMentorState(updatedState);
            return updatedState;
        }
        case mentorActionTypes.GET_STUDENTS_SUCCESS:
            const updatedMentor = { ...state, projects: action.payload, loading: false };
            saveMentorState(updatedMentor);
            return updatedMentor;

        case mentorActionTypes.GET_STUDENTS_REQUEST:
            saveMentorState({ ...state, loading: true });
            return { ...state, loading: true };

        case mentorActionTypes.GET_AVATAR_SUCCESS:
            console.log(state)
            const updatedMentorWithAvatar = { ...state, avatarURL: action.payload, loading: false,  };
            saveMentorState(updatedMentorWithAvatar);
            return updatedMentorWithAvatar;

        

        default:
            return state;
    }
};

export const updateInfoReducer = (state = initialMentorState, action) => {
    switch (action.type) {

        case mentorActionTypes.UPDATE_PASSWORD_REQUEST:
            return {
                ...state,
                isUpdating: true,
            };


        case mentorActionTypes.UPDATE_PASSWORD_SUCCESS:
            return {
                ...state,
                isUpdating: false,
            };


        case mentorActionTypes.UPDATE_PASSWORD_FAILURE:
            return {
                isUpdating: false,
                error: { ...action.payload },
            };

        default:
            return state;
    }
};

export const avatarReducer = (state = initialMentorState, action) => {
    console.log("hello", action.payload)
    switch (action.type) {
        case mentorActionTypes.AVATAR_REQUEST:
            return {
                ...state,
                isUploading: true,
            };
        case mentorActionTypes.AVATAR_SUCCESS:

            return {
                ...state,
                num: state.num + 1,

                isUploading: false,
            };
        case mentorActionTypes.AVATAR_FAILURE:
            return {
                isUploading: false,
                error: { ...action.payload },
            };
        default:
            return state;
    }
};

