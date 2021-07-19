import Axios from "axios";
import projectActionTypes from "./projectActionTypes";

const axios = Axios.create({
    baseURL: "https://ecell.iitm.ac.in/data",
    withCredentials: true,
});

const fetchProjectRequest = () => ({
    type: projectActionTypes.FETCH_PROJECTS_REQUEST,
});

const fetchProjectSuccess = (data) => ({
    type: projectActionTypes.FETCH_PROJECTS_SUCCESS,
    payload: data,
});
const fetchProjectFailure = (err) => ({
    type: projectActionTypes.FETCH_PROJECTS_FAILURE,
    payload: err,
});

export const fetchProjects = () => {
    return async (dispatch) => {
        dispatch(fetchProjectRequest());
        try {
            let response = await axios.get(`/team-up-portal/projects?for=student`);
            dispatch(fetchProjectSuccess(response.data));
        } catch (err) {
            let error = err.response ? err.response.data : err;
            // let errorMsg = error.data ? error.data.msg : error.message;
            dispatch(fetchProjectFailure(error));
        }
    };
};

const updateProjectRequest = () => ({
    type: projectActionTypes.UPDATE_PROJECT_REQUEST,
});

const updateProjectSuccess = (data) => ({
    type: projectActionTypes.UPDATE_PROJECT_SUCCESS,
    payload: data,
});
const updateProjectFailure = (err) => ({
    type: projectActionTypes.UPDATE_PROJECT_FAILURE,
    payload: err,
});

export const updateProject = (projectID) => {
    return async (dispatch) => {
        dispatch(updateProjectRequest());
        try {
            const res = await axios.put(`/team-up-portal/update-project-info/apply`, { projectID });
            const { studentID } = res.data;
            dispatch(updateProjectSuccess({ studentID, projectID }));

        } catch (err) {
            console.log(err);
            let error = err.response ? err.response.data : err;
            dispatch(updateProjectFailure(error));
        }
    };
};
