import express from 'express';

/**
 * Check if the url for image is valid
 * Send 404 if it is not valid
 * @param req
 * @param res
 * @param next
 */
const checkRoute = (
  req: express.Request,
  res: express.Response,
  next: Function
) => {
  // Try converting query parameters into object
  const queryObject = {
    filename: req.query.filename,
    width: parseInt(<string>req.query.width, 10),
    height: parseInt(<string>req.query.height, 10),
  };

  if (
    queryObject.filename === undefined ||
    queryObject.width === undefined ||
    queryObject.height === undefined
  ) {
    res
      .status(404)
      .send("No a valid url, should have 'filename', 'width' and 'height'");
  } else if (
    Number.isNaN(queryObject.width) ||
    Number.isNaN(queryObject.height)
  ) {
    res.status(404).send('Width and height of the image should be integers');
  } else if (queryObject.width < 0 || queryObject.height < 0) {
    res.status(404).send('Width and height of the image should be >= 0');
  } else {
    res.locals.queryObject = queryObject;

    next();
  }
};

export default checkRoute;
