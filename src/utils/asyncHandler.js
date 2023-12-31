import { ApiError } from "./ApiErrorRes.js"

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}

const simpleAsyncHandler = (requestHandler) => {
    return (arg) => {
        Promise.resolve(requestHandler(arg)).catch((err) => {
            throw new ApiError(500, "Something bad")
        })
    }
}

export { asyncHandler, simpleAsyncHandler }
