export const loadPersistedMentorState = () => {
    try {
        let persistedStateSerialized = localStorage.getItem("mentorData");
        if (persistedStateSerialized) {
            let persistedState = JSON.parse(persistedStateSerialized);
            return { mentor: { data: persistedState } };
        } else {
            return undefined;
        }
    } catch (error) {
        return undefined;
    }
};

export const saveMentorState = async (mentorData) => {
    try {
        if (!mentorData.hasOwnProperty("_id")) {
            // Ugly hack to tell the function not to store data if there is no actual data
            // I could do this from an ACTION but let's see
            return undefined;
        }
        localStorage.setItem("mentorData", JSON.stringify(mentorData));
    } catch (error) {
        console.log(error);
        return undefined;
    }
};

