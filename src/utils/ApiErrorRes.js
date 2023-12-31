class ApiError extends Error {
    constructor(
        statusCode,
        messege= "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(messege)
        this.statusCode = statusCode
        this.data = null
        this.messege = messege
        this.success = false
        this.error = errors

        if(stack) {
            this.stack = stack
        } else {
            Error?.captureStackTrace(this, this.contructor)
        }
    }
}

class ApiResponse {
    constructor( statusCode, data, messege="Success"){
        this.statusCode = statusCode
        this.data = data
        this.messege = messege
        this.success = statusCode < 400
    }
}

export { ApiError, ApiResponse }
