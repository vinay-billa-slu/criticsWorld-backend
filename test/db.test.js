const { connectToDatabase } = require("../config/db");
const mysql = require("mysql2/promise");

jest.mock("mysql2/promise", () => ({
  createPool: jest.fn(() => ({
    getConnection: jest.fn().mockResolvedValue({
      release: jest.fn(),
    }),
  })),
}));

test("should successfully connect to the database and release the connection", async () => {
  const connection = await connectToDatabase();
  
  expect(mysql.createPool).toHaveBeenCalled();
  expect(connection.release).toHaveBeenCalled();
});

