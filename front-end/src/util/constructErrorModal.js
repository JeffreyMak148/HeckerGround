function constructErrorModal (errorStatus, errorMessage, hideStatusCode) {
    return {status: errorStatus, data: {errorMessage: errorMessage}, hideStatusCode: hideStatusCode};
}

export default constructErrorModal;