import studentActionTypes from "../student/studentActionTypes";
import projectActionTypes from "./projectActionTypes";

const initialProjectState = {
    isFetching: false,
    data: [],
    error: "",
};

export const projectDataReducer = (state = initialProjectState, action) => {
    switch (action.type) {
        case projectActionTypes.FETCH_PROJECTS_REQUEST:
            return {
                ...state,
                isFetching: true,
            };
        case projectActionTypes.FETCH_PROJECTS_SUCCESS:
            return {
                isFetching: false,
                data: action.payload.data,
                error: "",
            };
        case projectActionTypes.FETCH_PROJECTS_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: action.payload,
            };
        case projectActionTypes.UPDATE_PROJECT_REQUEST:
            return {
                ...state,
                isFetching: true,
            };
        case projectActionTypes.UPDATE_PROJECT_SUCCESS:
            return {
                ...state,
                isFetching: false,
            };
        case projectActionTypes.UPDATE_PROJECT_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: action.payload,
            };
        case studentActionTypes.LOGOUT_SUCCESS:
            return initialProjectState;
        
        default:
            return state;
    }
};
