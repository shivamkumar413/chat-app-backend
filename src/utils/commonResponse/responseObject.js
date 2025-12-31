export const internalServerErrorResponse = (error) => {
    return {
        success: false,
        err: error,
        data: null,
        message: 'Internal server error'
    };
};

export const customErrorResponse = (error) => {
    if (!error.message && !error.explanation) {
        return internalServerErrorResponse(error);
    }
    return {
        success: false,
        err: error.explanation,
        data: {},
        message: error.message
    };
};

export const customSuccessResponse = (data, message) => {
    return {
        success: true,
        message,
        data
    };
};
