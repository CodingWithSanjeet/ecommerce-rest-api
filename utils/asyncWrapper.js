const asyncWrapper = (funct) => {
  return (req, res, next) => {
    funct(req, res, next).catch((err) => next(err));
  }
};
module.exports = asyncWrapper;
