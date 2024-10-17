const HttpException = require("../middleware/HttpException");

describe("HttpException", () => {
  it("should create an error with success, status, and message", () => {
    const success = false;
    const status = 404;
    const message = "Resource not found";

    const exception = new HttpException(success, status, message);

    expect(exception).toBeInstanceOf(Error);  // Should extend the built-in Error class
    expect(exception.success).toBe(success);
    expect(exception.status).toBe(status);
    expect(exception.message).toBe(message);
  });

  it("should inherit properties from Error class", () => {
    const message = "Server Error";

    const exception = new HttpException(false, 500, message);

    // Ensure it behaves like an Error object
    expect(exception.stack).toBeDefined();  // Stack trace should be defined
    expect(exception.name).toBe("Error");   // Default error name
    expect(exception.message).toBe(message); // Message inherited from Error
  });
});
