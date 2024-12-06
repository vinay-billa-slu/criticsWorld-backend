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
