import Axios from "axios";
import studentActionTypes from "./studentActionTypes";
import store from "../store";
import { updateProject } from "../projects/projectActions";
import getCookieToken from "../../utils/getCookieToken";

const axios = Axios.create({
    baseURL: "https://ecell.iitm.ac.in/data/team-up-portal",
    withCredentials: true,
});

const studentLoginRequest = () => ({
    type: studentActionTypes.LOGIN_REQUEST,
});

const studentLoginSuccess = (data) => ({
    type: studentActionTypes.LOGIN_SUCCESS,
    payload: data,
});
const studentLoginFailure = (err) => ({
    type: studentActionTypes.LOGIN_FAILURE,
    payload: err,
});

export const loginStudent = (dataToPost, handleSuccess, handleError) => {
    return async (dispatch) => {
        dispatch(studentLoginRequest());
        try {
            let res = await axios.post(`/login`, dataToPost);
            if (getCookieToken()) {
                dispatch(studentLoginSuccess(res.data));
                handleSuccess();
            } else throw new Error("An error occured.");
        } catch (error) {
            console.log(error);
            let errorMsg = error.response ? error.response.data.msg : error.message;
            dispatch(studentLoginFailure(error.response ? error.response.data : error));
            handleError(errorMsg);
        }
    };
};

const studentRegisterRequest = () => ({
    type: studentActionTypes.REGISTER_REQUEST,
});

const studentRegisterSuccess = (data) => ({
    type: studentActionTypes.REGISTER_SUCCESS,
    payload: data,
});
const studentRegisterFailure = (err) => ({
    type: studentActionTypes.REGISTER_FAILURE,
    payload: err,
});

export const registerStudent = (dataToPost, handleSuccess, handleError) => {
    return async (dispatch) => {
        dispatch(studentRegisterRequest());

        try {
            let res = await axios.post("/register-participant", dataToPost);
            dispatch(studentRegisterSuccess(res.data));
            handleSuccess();
        } catch (err) {
            let error = err.response ? err.response.data : err;
            let errorMsg = error.msg ? error.msg : error.message;
            dispatch(studentRegisterFailure(error));
            handleError(errorMsg);
        }
    };
};

const studentLogoutRequest = () => ({
    type: studentActionTypes.LOGOUT_REQUEST,
});

const studentLogoutSuccess = () => ({
    type: studentActionTypes.LOGOUT_SUCCESS,
});
const studentLogoutFailure = (err) => ({
    type: studentActionTypes.LOGOUT_FAILURE,
    payload: err,
});

export const logoutStudent = (handleSuccess, handleError) => {
    return async (dispatch) => {
        dispatch(studentLogoutRequest());
        try {
            await axios.get(`/logout/student`);
            handleSuccess();
            dispatch(studentLogoutSuccess());
        } catch (err) {
            console.log(err);
            let error = err.response ? err.response.data : err;
            let errorMsg = error.response ? error.response.data.msg : error.message;
            dispatch(studentLogoutFailure(error));
            handleError(errorMsg);
        }
    };
};

const uploadRequest = (type) => ({
    type: studentActionTypes[`${type.toUpperCase()}_REQUEST`],
});

const uploadSuccess = (type, data) => ({
    type: studentActionTypes[`${type.toUpperCase()}_SUCCESS`],
    payload: data,
});

const uploadFailure = (type, err) => ({
    type: studentActionTypes[`${type.toUpperCase()}_FAILURE`],
    payload: err,
});
/**
 *
 * @param {string} type
 * @param {File} file
 */
export const upload = (type, file, handleSuccess = () => {}, handleError = () => {}) => {
    return async (dispatch) => {
        dispatch(uploadRequest(type));
        try {
            const res = await axios.get(`/s3-signed-policy/team-up-student-${type}s`);

            let S3SignedPolicyObject = { ...res.data.data };
            let bucketWriteUrl = `https://${S3SignedPolicyObject.bucket}.s3.ap-south-1.amazonaws.com/`;

            const { _id: studentID, name, roll } = store.getState().student.data;
            const filename = `${name.replace(/ /g, "")}-${roll}-${type.toUpperCase()}.${file.name.split(".").pop()}`;

            async function makeFormdataAndUpload() {
                var fd = new FormData();

                fd.append("x-amz-algorithm", "AWS4-HMAC-SHA256");
                fd.append("acl", S3SignedPolicyObject.bucketAcl);
                fd.append("policy", S3SignedPolicyObject.encodedPolicy);
                fd.append("x-amz-credential", S3SignedPolicyObject.amzCred);
                fd.append("x-amz-date", S3SignedPolicyObject.expirationStrClean);
                fd.append("X-Amz-Signature", S3SignedPolicyObject.sign);

                fd.append("key", filename);
                fd.append("Content-Type", file.type);

                fd.append("file", file);

                await axios.post(bucketWriteUrl, fd, { withCredentials: false });
            }
            await makeFormdataAndUpload();

            let URL = `${bucketWriteUrl}${filename}`;

            await axios.put(`/update-student-info/${type}`, { studentID, [`${type}URL`]: URL });

            dispatch(uploadSuccess(type, URL));
            handleSuccess();
        } catch (err) {
            console.log(err);
            let error = err.response ? err.response.data : err;
            let errorMsg = error.response ? error.response.data.msg : error.message;
            dispatch(uploadFailure(type, error));
            handleError(errorMsg);
        }
    };
};

const applyProjectRequest = () => ({
    type: studentActionTypes.APPLY_PROJECT_REQUEST,
});

const applyProjectSuccess = (data) => ({
    type: studentActionTypes.APPLY_PROJECT_SUCCESS,
    payload: data,
});

const applyProjectFailure = (err) => ({
    type: studentActionTypes.APPLY_PROJECT_FAILURE,
    payload: err,
});

export const applyToProject = (projectID, handleSuccess) => {
    return async (dispatch) => {
        dispatch(applyProjectRequest());

        const studentID = store.getState().student.data._id;
        try {
            await axios.put("/update-student-info/project", { studentID, projectID });

            await dispatch(updateProject(projectID));
            dispatch(applyProjectSuccess({ studentID, projectID }));
            handleSuccess();
        } catch (err) {
            console.log(err);
            let error = err.response ? err.response.data : err;
            dispatch(applyProjectFailure(error));
        }
    };
};

const updateStudentDataRequest = () => ({
    type: studentActionTypes.UPDATE_STUDENT_REQUEST,
});

const updateStudentDataSuccess = (data) => ({
    type: studentActionTypes.UPDATE_STUDENT_SUCCESS,
    payload: data,
});

const updateStudentDataFailure = (err) => ({
    type: studentActionTypes.UPDATE_STUDENT_FAILURE,
    payload: err,
});

export const updateStudentData = (dataToUpdate, handleError, handleSuccess) => {
    return async (dispatch) => {
        dispatch(updateStudentDataRequest());

        try {
            const updated = await axios.put("/update-student-info/data", { dataToUpdate });
            dispatch(updateStudentDataSuccess(updated.data.data));
            handleSuccess();
        } catch (err) {
            console.log(err);
            let error = err.response ? err.response.data : err;
            dispatch(updateStudentDataFailure(error));
            handleError(error.msg);
            console.log(error);
        }
    };
};

const updatePasswordRequest = () => ({
    type: studentActionTypes.UPDATE_PASSWORD_REQUEST,
});

const updatePasswordSuccess = () => ({
    type: studentActionTypes.UPDATE_PASSWORD_SUCCESS,
});

const updatePasswordFailure = (err) => ({
    type: studentActionTypes.UPDATE_PASSWORD_FAILURE,
    payload: err,
});

export const updateStudentPassword = (passwords, handleError, handleSuccess) => {
    return async (dispatch) => {
        dispatch(updatePasswordRequest());

        try {
            await axios.put("/update-student-info/password", { passwords });

            dispatch(updatePasswordSuccess());
            handleSuccess();
        } catch (err) {
            console.log(err);
            let error = err.response ? err.response.data : err;
            dispatch(updatePasswordFailure(error));
            handleError(error.msg);
            console.log(error);
        }
    };
};
