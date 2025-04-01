import { validationResult } from "express-validator";

export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error); // forward error to error handler
};

export const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    status: err.status || 500,
    errors: err.errors,
  });
};

export const validationErrorHandler = (req, res, next) => {
  const errors = validationResult(req, { strictParams: ["body"] });
  if (!errors.isEmpty()) {
    const error = new Error("Bad Request");
    error.status = 400;
    error.errors = errors.array({ onlyFirstError: true }).map((error) => {
      return { field: error.path, message: error.msg };
    });
    return next(error);
  }
  next();
};

export const customError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};
