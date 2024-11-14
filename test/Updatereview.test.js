const { updateReview, getReview } = require('../controllers/Review');
const { connectToDatabase } = require('../config/db');
const HttpException = require('../middleware/HttpException');

jest.mock('../config/db', () => ({
  connectToDatabase: jest.fn()
}));

jest.mock('../controllers/Review', () => ({
  ...jest.requireActual('../controllers/Review'),
  getReview: jest.fn()
}));

describe("updateReview", () => {
  it("should update a review when the user is authorized", async () => {
    const mockConnection = { query: jest.fn() };
    connectToDatabase.mockResolvedValue(mockConnection);

    const reviewData = {
      UserID: 1,
      MovieID: 1,
      ReviewID: 1,
      ReviewTitle: "Updated Title",
      Rating: 4
    };

    getReview.mockResolvedValue({ ReviewID: 1, UserID: 1 });
    mockConnection.query.mockResolvedValue([[{ ReviewID: 1, UserID: 1 }], {}]); // Mock query to return rows array

    await updateReview(reviewData, { UserID: 1, isAdmin: false });
    expect(mockConnection.query).toHaveBeenCalledWith(
      "UPDATE Review SET ReviewTitle=?, Rating=? where ReviewID=?",
      [reviewData.ReviewTitle, reviewData.Rating, reviewData.ReviewID]
    );
  });

  it("should throw an error if the review does not exist", async () => {
    const mockConnection = { query: jest.fn() };
    connectToDatabase.mockResolvedValue(mockConnection);

    getReview.mockResolvedValue(null);
    mockConnection.query.mockResolvedValue([[], {}]); // Mock query to return an empty rows array

    const reviewData = {
      UserID: 1,
      MovieID: 1,
      ReviewID: 999,
      ReviewTitle: "Nonexistent Review",
      Rating: 3
    };

    await expect(updateReview(reviewData, { UserID: 1, isAdmin: false })).rejects.toThrow("No such review");
  });
});
