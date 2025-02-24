import createHttpError from "http-errors";
export const notFoundHandler = (req,res) => {
    const error = createHttpError(404,"Route not found")
    return res.status(404).json({
        status: error.status,
        message: error.message,
    })

}

export default notFoundHandler;