const { UserTokens } = require("../models/Movies");

exports.authorize = (req, res, next) => {
  const { token } = req.query;
  UserTokens.all((users) => {
    const isAuthorization = users.some((user) => user.token === token);
    isAuthorization
      ? next()
      : res.status(401).json({ message: "Unauthorized" });
  });
};
