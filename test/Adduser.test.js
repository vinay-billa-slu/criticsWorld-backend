const { addUser, getUser } = require('../controllers/User');
const { connectToDatabase } = require('../config/db');
const HttpException = require('../middleware/HttpException');
const CryptoJs = require("crypto-js");

jest.mock('../config/db', () => ({
  connectToDatabase: jest.fn()
}));

describe("addUser", () => {
  it("should add a user successfully when valid data is provided", async () => {
    const mockConnection = { query: jest.fn() };
    connectToDatabase.mockResolvedValue(mockConnection);

    // Mock getUser to simulate no existing user
    jest.spyOn(require('../controllers/User'), "getUser").mockResolvedValue(null);

    const userData = {
      FirstName: "Jane",
      LastName: "Doe",
      Email: "jane@example.com",
      Password: "password123"
    };

    mockConnection.query.mockResolvedValue([[], {}]); // Mock query to return an empty result for addUser

    await addUser(userData);

    expect(mockConnection.query).toHaveBeenCalledWith(
      "INSERT INTO User (FirstName, LastName, Email, Password) VALUES (?);",
      [[userData.FirstName, userData.LastName, userData.Email, expect.any(String)]]
    );
  });

  it("should throw an error if user already exists", async () => {
    const mockConnection = { query: jest.fn() };
    connectToDatabase.mockResolvedValue(mockConnection);

    // Mock getUser to simulate an existing user
    jest.spyOn(require('../controllers/User'), "getUser").mockResolvedValue([{ UserID: 1 }]);

    const userData = {
      FirstName: "Jane",
      LastName: "Doe",
      Email: "jane@example.com",
      Password: "password123"
    };

    // Mock the query to return user existence for getUser call in addUser
    mockConnection.query.mockResolvedValue([[{ UserID: 1, Email: "jane@example.com" }], {}]);

    await expect(addUser(userData)).rejects.toThrow("User already existed");
  });
});
