const { connectToDatabase } = require("../config/db");
const { addUser, getUserByEmail, deleteUser, updateUser } = require("../controllers/User");

// Mock the `connectToDatabase` function
jest.mock("../config/db", () => {
  const mockQuery = jest.fn();  // Create a mock for the `query` method
  return {
    connectToDatabase: jest.fn().mockResolvedValue({
      query: mockQuery,
      release: jest.fn(),
    }),
    mockQuery,  // Export `mockQuery` for use in tests
  };
});

// Destructure `mockQuery` for easy access in test cases
const { mockQuery } = require("../config/db");

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

describe("addUser", () => {
  it("should successfully add a new user", async () => {
    mockQuery.mockResolvedValueOnce([[]]); // No existing user found
    mockQuery.mockResolvedValueOnce([{ insertId: 1 }]); // Simulate insert success
    
    const body = { FirstName: "John", LastName: "Doe", Email: "john@example.com", Password: "password123" };
    await expect(addUser(body)).resolves.not.toThrow();
  });

  it("should throw 400 error if email already exists", async () => {
    mockQuery.mockResolvedValueOnce([[{ UserID: 1, Email: "john@example.com" }]]); // Existing user found

    const body = { FirstName: "John", LastName: "Doe", Email: "john@example.com", Password: "password123" };
    await expect(addUser(body)).rejects.toThrow("User already existed");
  });
});

describe("getUserByEmail", () => {
  it("should return user data for a valid email", async () => {
    mockQuery.mockResolvedValueOnce([[{ UserID: 1, FirstName: "John", LastName: "Doe", Email: "john@example.com" }]]);
    
    const body = { Email: "john@example.com" };
    const user = await getUserByEmail(body);
    expect(user).toHaveProperty("UserID", 1);
    expect(user).toHaveProperty("Email", "john@example.com");
  });

  it("should return null for a non-existing email", async () => {
    mockQuery.mockResolvedValueOnce([[]]); // No user found

    const body = { Email: "nonexistent@example.com" };
    const user = await getUserByEmail(body);
    expect(user).toBeNull();
  });
});

// Additional test cases for `deleteUser`, `updateUser`, etc.
