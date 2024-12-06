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
};

