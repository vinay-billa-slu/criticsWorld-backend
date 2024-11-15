const { connectToDatabase } = require("../config/db");
const mysql = require("mysql2/promise");

// Set up Jest to mock the `mysql2/promise` module
jest.mock("mysql2/promise", () => {
  const mockRelease = jest.fn();
  const mockGetConnection = jest.fn().mockResolvedValue({
    query: jest.fn(),
    release: mockRelease,
  });

  return {
    createPool: jest.fn(() => ({
      getConnection: mockGetConnection,
    })),
    mockRelease, // Exporting for assertions
    mockGetConnection, // Exporting for assertions
  };
});

test("should successfully connect to the database and release the connection", async () => {
  const connection = await connectToDatabase();
  
  expect(mysql.createPool).toHaveBeenCalled();
  expect(connection.query).toBeDefined(); // Ensure query is defined
  expect(connection.release).toBeDefined(); // Ensure release is defined
  
  connection.release(); // Call release
  expect(mysql.mockRelease).toHaveBeenCalled(); // Verify release was called on the mock
});
