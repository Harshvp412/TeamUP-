export const initialLoginState = {
    loggingIn: false,
    error: {},
};

export const initialRegisterState = {
    registering: false,
    error: {},
};
export const initialStudentState = {
    name: "",
    email: "",
    password: "",
    roll: "",
    phone: "",
    yearOfStudy: "",
    cvUploaded: false,
    cvURL: "",
    appliedProjects: [],
};

export const initialCVState = {
    isUploading: false,
    data: {},
    error: {},
};

export const initialAvatarState = {
    isUploading: false,
    data: {},
    error: {},
};

export const initialUpdateState = {
    isUpdating: false,
    data: {},
    error: {},
};
