const { connectToDatabase } = require("../config/db");
const HttpException = require("../middleware/HttpException");
const Joi = require("joi");

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
    if (review) {
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

const deleteReview = async (body, user) => {
    const connection = await connectToDatabase();
    const review = await getReview(body);
    if (review) {
      if (review.UserID == user.UserID || user.isAdmin) {
        await connection.query("DELETE from Review where ReviewID=?", [
          body.ReviewID,
        ]);
      } else {
        throw new HttpException(false, 401, "You are not allowed");
      }
    } else {
      throw new HttpException(true, 200, "No such review");
    }
  };