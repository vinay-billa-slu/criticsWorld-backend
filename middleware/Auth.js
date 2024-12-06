const jwt = require("jsonwebtoken");
const config = require("../config");

const verifyToken = (request, response, next) => {
  const authToken = request.headers.token;
  
  // Use early return for cleaner flow
  if (!authToken) {
    return response.status(401).json({
      success: false,
      message: "You are not authenticated.",
    });
  }

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
};

const verifyTokenAndAdmin = (request, response, next) => {
  verifyToken(request, response, () => {
    // Early return to handle unauthorized users
    return request.user.isAdmin 
      ? next() 
      : response.status(401).json({
          success: false,
          message: "You are not allowed.",
        });
  });
};

const verifyTokenAndAuthorization = (request, response, next) => {
  verifyToken(request, response, () => {
    // Use a ternary to check the condition and call next or return an error
    return (request.user.id === request.params.id || request.user.isAdmin) 
      ? next() 
      : response.status(401).json({
          success: false,
          message: "You are not allowed.",
        });
  });
};
