const request = require("supertest");
const express = require("express");
const { ErrorMiddleWare } = require("../middleware/ErrorMiddleWare");

const app = express();

// Example route to trigger errors
app.get("/error", (req, res, next) => {
  const error = new Error("Custom error message");
  error.status = 400;
  error.success = false;
  next(error);
});

// Apply error middleware
app.use(ErrorMiddleWare);

describe("ErrorMiddleWare", () => {

  it("should return custom error response when error details are provided", async () => {
    const res = await request(app).get("/error");
    expect(res.statusCode).toBe(400); // Custom status
    expect(res.body).toEqual({
      success: false,
      status: 400,
      message: "Custom error message", // Custom message
    });
  });

});
