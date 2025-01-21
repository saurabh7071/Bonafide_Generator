class ApiResponse {

    constructor(statusCode, data, message = "Success!", error = null) {
        this.statusCode = statusCode;
        this.success = statusCode >= 200 && statusCode < 400;
        this.message = message;
        this.data = data;
        this.error = error;
    }
}

export { ApiResponse };