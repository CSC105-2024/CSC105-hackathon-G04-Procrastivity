export const setCookie = (res, token) => {
    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
};

export const clearCookie = (res) => {
    res.clearCookie('token');
};