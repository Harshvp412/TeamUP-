/**
 *
 * @param {object} initialValues
 * @param {object} newValues
 */

const compareFields = (initialValues, newValues) => {
    // const changedFields = Object.keys(newValues).filter((field) => newValues[field] !== initialValues[field]);
    // if (changedFields.length === 0) {
    //     return null;
    // }
    // const onlyNewValues = changedFields.map((field) => ({ [field]: newValues[field] }));
    const onlyNewValues = {};

    for (const field in newValues) {
        if (newValues[field] !== initialValues[field]) {
            onlyNewValues[field] = newValues[field];
        }
    }

    if (Object.keys(onlyNewValues).length === 0) return null;
    return onlyNewValues;
};

export default compareFields;
