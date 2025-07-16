const { StatusCodes } = require("http-status-codes");

const notFound = (req, res) => {
res.status(StatusCodes.NOT_FOUND).json({
    status: "fail",
    message: `The requested route '${req.originalUrl}' was not found on this server.`,
});
};

module.exports = notFound;
