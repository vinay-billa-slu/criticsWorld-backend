const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } = require("../middleware/Auth");
const config = require("../config/index.js");

const app = express();
app.use(express.json());

describe("Auth Middleware", () => {
  const validToken = jwt.sign({ id: "123", isAdmin: true }, config.JWT_SEC_KEY);
  const invalidToken = "invalidToken";
  
  app.get("/protected", verifyToken, (req, res) => {
    res.status(200).json({ success: true });
  });

  app.get("/admin", verifyTokenAndAdmin, (req, res) => {
    res.status(200).json({ success: true });
  });

  app.get("/user/:id", verifyTokenAndAuthorization, (req, res) => {
    res.status(200).json({ success: true });
  });

  // Test cases for verifyToken
  it("should return 401 if no token is provided", async () => {
    const res = await request(app).get("/protected");
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("You are not authenticated.");
  });

  it("should verify a valid token", async () => {
    const res = await request(app).get("/protected").set("token", validToken);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should return 401 for invalid token", async () => {
    const res = await request(app).get("/protected").set("token", invalidToken);
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("You are not authenticated.");
  });

  // Test cases for verifyTokenAndAdmin
  it("should return 401 if user is not an admin", async () => {
    const userToken = jwt.sign({ id: "123", isAdmin: false }, config.JWT_SEC_KEY);
    const res = await request(app).get("/admin").set("token", userToken);
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("You are not allowed.");
  });

  it("should return 200 if user is admin", async () => {
    const adminToken = jwt.sign({ id: "123", isAdmin: true }, config.JWT_SEC_KEY);
    const res = await request(app).get("/admin").set("token", adminToken);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // Test cases for verifyTokenAndAuthorization
  it("should allow access if user ID matches the request params", async () => {
    const userToken = jwt.sign({ id: "123", isAdmin: false }, config.JWT_SEC_KEY);
    const res = await request(app).get("/user/123").set("token", userToken);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should allow access if user is admin", async () => {
    const adminToken = jwt.sign({ id: "456", isAdmin: true }, config.JWT_SEC_KEY);
    const res = await request(app).get("/user/789").set("token", adminToken);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should return 401 if user ID does not match and is not admin", async () => {
    const userToken = jwt.sign({ id: "123", isAdmin: false }, config.JWT_SEC_KEY);
    const res = await request(app).get("/user/456").set("token", userToken);
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("You are not allowed.");
  });
});
