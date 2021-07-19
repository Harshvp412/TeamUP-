import mentorActionTypes from "./mentorActionTypes";
import Axios from "axios";
import getCookieToken from "../../utils/getCookieToken";
import store from "../storeMentor";


const axios = Axios.create({
    baseURL: "https://ecell.iitm.ac.in/data",
    withCredentials: true,
});

const checkStatus = (student, selectedStudents, shortlistedStudents) => {
    if (selectedStudents.filter((s) => s._id === student._id)[0]) return "selected";
    else if (shortlistedStudents.filter((s) => s._id === student._id)[0]) return "shortlisted";
    else return "none";
};

const mentorLoginRequest = () => ({
    type: mentorActionTypes.LOGIN_REQUEST,
});
const mentorLoginSuccess = (data) => ({
    type: mentorActionTypes.LOGIN_SUCCESS,
    payload: data,
});
const mentorLoginFailure = (err) => ({
    type: mentorActionTypes.LOGIN_FAILURE,
    payload: err,
});

export const loginMentor = (dataToPost, handleSuccess, handleError) => {
    return async (dispatch) => {
        dispatch(mentorLoginRequest());
        try {
            let res = await axios.post(`/team-up-portal/mentor/login`, dataToPost);
            let res2 = await axios.get(`/team-up-portal/mentor/projects`);

            if (getCookieToken()) {
                const projects = await res2.data.data.map((project) => {
                    return {
                        ...project,
                        name: project.title,
                        projectID: project.title.toLowerCase().split(" ").join("-"),
                    };
                });
                const mentor = { ...res.data.data, projects };
                dispatch(mentorLoginSuccess(mentor));
                handleSuccess();
            } else throw new Error("an error occured");
        } catch (error) {
            console.log(error);
            let errorMsg = error.response ? error.response.data.msg : error.message;
            dispatch(mentorLoginFailure(error.response ? error.response.data : error));
            handleError(errorMsg);
        }
    };
};

const selectStudentRequest = () => ({
    type: mentorActionTypes.SELECT_STUDENT_REQUEST,
});

const selectStudentSuccess = (data) => ({
    type: mentorActionTypes.SELECT_STUDENT_SUCCESS,
    payload: data,
});

const selectStudentFailure = (err) => ({
    type: mentorActionTypes.SELECT_STUDENT_FAILURE,
    payload: err,
});

const shortlistStudentRequest = () => ({
    type: mentorActionTypes.SHORTLIST_STUDENT_REQUEST,
});

const shortlistStudentSuccess = (data) => ({
    type: mentorActionTypes.SHORTLIST_STUDENT_SUCCESS,
    payload: data,
});

const shortlistStudentFailure = (err) => ({
    type: mentorActionTypes.SHORTLIST_STUDENT_FAILURE,
    payload: err,
});
export const selectStudent = (
    student,
    project,
    handleSuccess = (msg) => console.log(msg),
    handleError = (msg) => console.log(msg)
) => {
    return async (dispatch) => {
        dispatch(selectStudentRequest());

        const studentCode = student.studentID;
        const projectCode = project.projectID;
        const studentID = student._id;
        const studentMail = student.email ;
        const projectID = project._id;
        try {
            await axios.put("team-up-portal/mentor/update-project-info/select-student", {
                projectID,
                studentID,
            });
            await dispatch(selectStudentSuccess({ studentCode, projectCode }));
            await axios.post("team-up-portal/mail/selection", {
                projectID,
                studentMail,
            })
            handleSuccess();
        } catch (err) {
            let error = err.response ? err.response.data : err;
            let errorMsg = error.data ? error.data.msg : error.message;
            dispatch(selectStudentFailure(error));
            handleError(errorMsg);
        }
    };
};

export const shortlistStudent = (
    student,
    project,
    handleSuccess = (msg) => console.log(msg),
    handleError = (msg) => console.log(msg)
) => {
    return async (dispatch) => {
        dispatch(shortlistStudentRequest());

        const studentCode = student.studentID;
        const projectCode = project.projectID;
        const studentID = student._id;
        const projectID = project._id;

        try {
            await axios.put("team-up-portal/mentor/update-project-info/shortlist-student", {
                projectID,
                studentID,
            });
            await dispatch(shortlistStudentSuccess({ studentCode, projectCode }));
            handleSuccess();
        } catch (err) {
            let error = err.response ? err.response.data : err;
            let errorMsg = error.data ? error.data.msg : error.message;
            dispatch(shortlistStudentFailure(error));
            handleError(errorMsg);
        }
    };
};

const mentorLogoutRequest = () => ({
    type: mentorActionTypes.LOGOUT_REQUEST,
});

const mentorLogoutSuccess = () => ({
    type: mentorActionTypes.LOGOUT_SUCCESS,
});
const mentorLogoutFailure = (err) => ({
    type: mentorActionTypes.LOGOUT_FAILURE,
    payload: err,
});

export const logoutMentor = (handleSuccess = (msg) => console.log(msg), handleError = (msg) => console.log(msg)) => {
    return async (dispatch) => {
        dispatch(mentorLogoutRequest());
        try {
            await axios.get(`/team-up-portal/mentor/logout`);
            dispatch(mentorLogoutSuccess());
            handleSuccess();
        } catch (err) {
            console.log(err);
            let error = err.response ? err.response.data : err;
            let errorMsg = error.response ? error.response.msg : error.message;
            dispatch(mentorLogoutFailure(error));
            handleError(errorMsg);
        }
    };
};

const getStudentsRequest = () => ({
    type: mentorActionTypes.GET_STUDENTS_REQUEST,
});
const getStudentsSuccess = (data) => ({
    type: mentorActionTypes.GET_STUDENTS_SUCCESS,
    payload: data,
});
const getStudentsFailure = (err) => ({
    type: mentorActionTypes.GET_STUDENTS_FAILURE,
    payload: err,
});

export const getStudents = (
    projectID,
    handleSuccess = (msg) => console.log(msg),
    handleError = (msg) => console.log(msg)
) => {
    return async (dispatch) => {
        dispatch(getStudentsRequest());
        try {
            let res1 = await axios.get(`/team-up-portal/mentor/projects`);
            let res2 = await axios.get(`/team-up-portal/mentor/projects/applied-students?for=${projectID}`);
            let res3 = await axios.get(`/team-up-portal/mentor/projects/selected-students?for=${projectID}`);
            let res4 = await axios.get(`/team-up-portal/mentor/projects/shortlisted-students?for=${projectID}`);

            const appliedStudents = res2.data.data;
            const selectedStudents = res3.data.data;
            const shortlistedStudents = res4.data.data;

            if (getCookieToken()) {
                const updatedAppliedStudents = appliedStudents.map((student) => {
                    return {
                        ...student,
                        studentID: student.name.toLowerCase().split(" ").join("-"),
                        status: checkStatus(student, selectedStudents, shortlistedStudents),
                    };
                });
                const projects = res1.data.data.map((project) => {
                    return {
                        ...project,
                        projectID: project.title.toLowerCase().split(" ").join("-"),
                        appliedStudents: updatedAppliedStudents,
                        name: project.title,
                    };
                });
                dispatch(getStudentsSuccess(projects));
                handleSuccess();
            } else throw new Error("an error occured");
        } catch (error) {
            console.log(error);
            let errorMsg = error.response ? error.response.data : error.message;
            dispatch(getStudentsFailure(error.response ? error.response : error));
            handleError(errorMsg);
        }
    };
};

const updatePasswordRequest = () => ({
    type: mentorActionTypes.UPDATE_PASSWORD_REQUEST,
});

const updatePasswordSuccess = () => ({
    type: mentorActionTypes.UPDATE_PASSWORD_SUCCESS,
});

const updatePasswordFailure = (err) => ({
    type: mentorActionTypes.UPDATE_PASSWORD_FAILURE,
    payload: err,
});

export const updateMentorPassword = (passwords, handleError, handleSuccess) => {
    return async (dispatch) => {
        dispatch(updatePasswordRequest());

        try {
            await axios.put("/team-up-portal/mentor/update-mentor-info/password", { passwords });

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



const uploadRequest = (type) => ({
    type: mentorActionTypes[`${type.toUpperCase()}_REQUEST`],
});

const uploadSuccess = (type, data) => ({
    type: mentorActionTypes[`${type.toUpperCase()}_SUCCESS`],
    payload: data,
});

const uploadFailure = (type, err) => ({
    type: mentorActionTypes[`${type.toUpperCase()}_FAILURE`],
    payload: err,
});
/**
 *
 * @param {string} type
 * @param {File} file
 */
export const upload = (type, file) => {
    return async (dispatch) => {
        dispatch(uploadRequest(type));
        try {
            const res = await axios.get(`/team-up-portal/s3-signed-policy/team-up-mentor-${type}s`);

            let S3SignedPolicyObject = { ...res.data.data };
            let bucketWriteUrl = `https://${S3SignedPolicyObject.bucket}.s3.ap-south-1.amazonaws.com/`;

            const { _id: mentorID, name } = store.getState().mentor.data;
            const filename = `${name.replace(/ /g, "")}-${type.toUpperCase()}.${file.name.split(".").pop()}`;

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

            await axios.put(`/team-up-portal/mentor/update-mentor-info/${type}`, { mentorID, [`${type}URL`]: URL });

            dispatch(uploadSuccess(type, URL));

            // dispatch(avatarSuccess(type,URL));
        } catch (err) {
            console.log(err);
            let error = err.response ? err.response.data : err;
            dispatch(uploadFailure(type, error));
        }
    };
};

const getAvatarRequest = () => ({
    type: mentorActionTypes.GET_AVATAR_REQUEST,
});
const getAvatarSuccess = (data) => ({
    type: mentorActionTypes.GET_AVATAR_SUCCESS,
    payload: data,
});
const getAvatarFailure = (err) => ({
    type: mentorActionTypes.GET_AVATAR_FAILURE,
    payload: err,
});

export const getAvatar = (

    handleSuccess = (msg) => console.log(msg),
    handleError = (msg) => console.log(msg)
) => {
    return async (dispatch) => {
        dispatch(getAvatarRequest());
        try {
            let res = await axios.get(`/team-up-portal/mentor/avatar`);


            const mentorAvatar = res.data.data;

            if (getCookieToken()) {
                const updatedAvatar = mentorAvatar

                dispatch(getAvatarSuccess(updatedAvatar));
                handleSuccess();
            } else throw new Error("an error occured");
        } catch (error) {
            console.log(error);
            let errorMsg = error.response ? error.response.data : error.message;
            dispatch(getAvatarFailure(error.response ? error.response : error));
            handleError(errorMsg);
        }
    };
};
