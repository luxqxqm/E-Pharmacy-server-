import createHttpError from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  console.error('Error: ', err.message);
  const isProd = process.env.NODE_ENV === 'production';
  if (createHttpError.isHttpError(err)) {
    return res.status(err.status).json({
      message: err.message,
    });
  }
  res.status(500).json({
    message: !isProd
      ? err.message
      : 'Something went wrong. Please try again later.',
  });
};
