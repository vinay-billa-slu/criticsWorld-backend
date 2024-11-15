const { addReview, getReview,deleteReview, updateReview } = require("../controllers/Review"); // Update the path
const HttpException = require("../middleware/HttpException");

jest.mock("../config/db", () => ({
  connectToDatabase: jest.fn(),
}));

describe("Review Service", () => {
  let connection;

  beforeEach(() => {
    connection = { query: jest.fn() };
    require("../config/db").connectToDatabase.mockResolvedValue(connection);
  });

  const addReview = async (body) => {
    const schema = Joi.object().keys({
      UserID: Joi.number().required(),
      MovieID: Joi.number().required(),
      ReviewTitle: Joi.string().required(),
      Rating: Joi.number().greater(0).less(6).required(),
    });
  
    const result = schema.validate(body);
  
    if (result.error) {
      throw new HttpException(false, 400, result.error.details[0].message);
    } else {
      const review = await getReviewByUserAndMovieID(body);
      if (review && review.length > 0) {  // Check for review existence
        throw new HttpException(false, 400, "You can not add multiple reviews");
      } else {
        const q =
          "INSERT INTO Review (UserID, MovieID, ReviewTitle, Rating) VALUES (?);";
  
        const values = [body.UserID, body.MovieID, body.ReviewTitle, body.Rating];
  
        const connection = await connectToDatabase();
        await connection.query(q, [values]);
      }
    }
  };
  
   // Get review Test Case //

  describe("getReview", () => {
    it("should retrieve a review by ReviewID", async () => {
      connection.query.mockResolvedValueOnce([
        [{ ReviewID: 1, UserID: 1, MovieID: 1, ReviewTitle: "Awesome", Rating: 5 }],
      ]);

      const body = { ReviewID: 1 };
      const result = await getReview(body);

      expect(result).toEqual({ ReviewID: 1, UserID: 1, MovieID: 1, ReviewTitle: "Awesome", Rating: 5 });
    });

    it("should return null if the review does not exist", async () => {
      connection.query.mockResolvedValueOnce([[]]);

      const body = { ReviewID: 999 };
      const result = await getReview(body);

      expect(result).toBeNull();
    });
  });

  // Delete Revie Test Case //

  
  describe("deleteReview", () => {
    it("should delete a review if the user is authorized", async () => {
      const review = { ReviewID: 1, UserID: 1 };
      connection.query.mockResolvedValueOnce([[review]]);
      connection.query.mockResolvedValueOnce([null, { affectedRows: 1 }]);
  
      const body = { ReviewID: 1 };
      const user = { UserID: 1, isAdmin: false };
  
      await expect(deleteReview(body, user)).resolves.not.toThrow();
    });
  
    it("should throw an error if the user is not authorized to delete the review", async () => {
      connection.query.mockResolvedValueOnce([[{ ReviewID: 1, UserID: 2 }]]); // Mock data for another user
  
      const body = { ReviewID: 1 };
      const user = { UserID: 1, isAdmin: false };
  
      await expect(deleteReview(body, user)).rejects.toThrow("You are not allowed");
    });
  });
}); 