export const loadPersistedState = () => {
    try {
        let persistedStateSerialized = localStorage.getItem("studentData");
        if (persistedStateSerialized) {
            let persistedState = JSON.parse(persistedStateSerialized);
            return { student: { data: persistedState } };
        } else return undefined;
    } catch (error) {
        return undefined;
    }
};

export const saveUserState = async (studentData) => {
    try {
        if (!studentData.hasOwnProperty("_id")) {
            // Ugly hack to tell the function not to store data if there is no actual data
            // I could do this from an ACTION but let's see
            return undefined;
        }
        localStorage.setItem("studentData", JSON.stringify(studentData));
    } catch (error) {
        console.log(error);
        return undefined;
    }
};
