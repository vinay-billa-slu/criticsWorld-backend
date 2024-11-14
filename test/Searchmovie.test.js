const { addMovie, searchMovie } = require('../controllers/Movie');
const { connectToDatabase } = require('../config/db');

// Mock database connection
jest.mock('../config/db', () => ({
  connectToDatabase: jest.fn()
}));

describe("searchMovie", () => {
  it("should return movies matching the search keyword", async () => {
    const mockConnection = { query: jest.fn().mockResolvedValue([[{ MovieID: 1, Title: "Inception" }]]) };
    connectToDatabase.mockResolvedValue(mockConnection);

    const result = await searchMovie({ keyword: "Inception" });
    expect(result).toEqual([{ MovieID: 1, Title: "Inception" }]);
  });

  it("should return an empty array if no movies match the keyword", async () => {
    const mockConnection = { query: jest.fn().mockResolvedValue([[]]) };
    connectToDatabase.mockResolvedValue(mockConnection);

    const result = await searchMovie({ keyword: "Nonexistent Movie" });
    expect(result).toEqual([]);
  });
});
