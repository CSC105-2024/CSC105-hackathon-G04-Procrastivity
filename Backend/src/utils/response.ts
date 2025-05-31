export const successResponse = (data, message = 'Success') => {
    return {
        status: 'success',
        message,
        data
    };
}
export const errorResponse = (message, statusCode = 400) => {
    return {
        status: 'error',
        message,
        statusCode
    };
}