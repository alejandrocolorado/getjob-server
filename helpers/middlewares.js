const createError = require('http-errors');

exports.isLoggedin = () => (req, res, next) => {
  if (req.session.currentUser) next();
  else next(createError(401));
};

exports.isNotLoggedIn = () => (req, res, next) => {
  if (!req.session.currentUser) next();
  else next(createError(403));
};

exports.validationLogIn = () => (req, res, next) => {
  const { email, password } = req.body;
console.log(req.body);
  if (!email || !password) next(createError(400));
  else next();
}
