const jwt = require("jsonwebtoken");
const config = require("../config");

const verifyToken = (request, response, next) => {
  const authToken = request.headers.token;
  if (authToken) {
    jwt.verify(authToken, config.JWT_SEC_KEY, (error, user) => {
      if (error) {
        return response.status(401).json({
          success: false,
          message: "You are not authenticated.",
        });
      }
      request.user = user;
      next();
    });
  } else {
    return response.status(401).json({
      success: false,
      message: "You are not authenticated.",
    });
  }
};

const verifyTokenAndAdmin = (request, response, next) => {
  verifyToken(request, response, () => {
    if (request.user.isAdmin) {
      next();
    } else {
      return response.status(401).json({
        success: false,
        message: "You are not allowed.",
      });
    }
  });
};

const verifyTokenAndAuthorization = (request, response, next) => {
  verifyToken(request, response, () => {
    if (request.user.id === request.params.id || request.user.isAdmin) {
      next();
    } else {
      return response.status(401).json({
        success: false,
        message: "You are not allowed.",
      });
    }
  });
};

const userWithToken = (request, response, next) => {
  const authToken = request.headers.token;
  if (authToken) {
    jwt.verify(authToken, config.JWT_SEC_KEY, (error, user) => {
      if (user) {
        request.user = user;
      }
      next();
    });
  }
  next();
};

module.exports = {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
  userWithToken,
};
