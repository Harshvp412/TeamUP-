const getCookieToken = () => {
    
    if (!document.cookie) return null;

    const token = document.cookie
        .split(";")
        // Note: This `token` starts with a whitespace. Hence the trim method in the filtering.
        .filter((str) => str.trim().startsWith("ECELL_LOGGED_IN"))[0];

    if (!token) return null;

    const tokenVal = token.split("=")[1];
    return tokenVal;
};

export default getCookieToken;