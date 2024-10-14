const { connectToDatabase } = require("../config/db");
const HttpException = require("../middleware/HttpException");
const Joi = require("joi");

const addMovie = async (body) => {
  const schema = Joi.object().keys({
    Title: Joi.string().required(),
    ReleaseYear: Joi.number().required(),
    PosterImage: Joi.string().required(),
    Actors: Joi.array().required(),
    Director: Joi.string().required(),
  });

  const result = schema.validate(body);

  if (result.error) {
    
  } else {
    body.Actors = body.Actors.join(",");

    const q =
      "INSERT INTO Movie (Title, ReleaseYear, PosterImage, Actors, Director) VALUES (?);";

    const values = [
      body.Title,
      body.ReleaseYear,
      body.PosterImage,
      body.Actors,
      body.Director,
    ];

    const connection = await connectToDatabase();
    await connection.query(q, [values]);
  }
};

const getAllMovies = async () => {
  const connection = await connectToDatabase();
  // const q = "SELECT * FROM Movie;";
  const q =
    "SELECT Movie.*, ROUND(AVG(Review.Rating)) AS AvgRating FROM Movie LEFT JOIN Review ON Movie.MovieID = Review.MovieID GROUP BY Movie.MovieID;";
  const [rows] = await connection.query(q);
  return rows;
};

const getMovie = async (body) => {
  const connection = await connectToDatabase();

  // const q = "SELECT * from Movie where MovieID=?";
  const q =
    "SELECT Movie.*, ROUND(AVG(Review.Rating)) AS AvgRating FROM Movie LEFT JOIN Review ON Movie.MovieID = Review.MovieID WHERE Movie.MovieID=?;";
  const [rows] = await connection.query(q, [body.MovieID]);
  return rows.length > 0 ? rows[0] : null;
};

const deleteMovie = async (body) => {
  const connection = await connectToDatabase();
  const movie = await getMovie(body);
  if (movie) {
    await connection.query("DELETE from Review where MovieID=?", [
      body.MovieID,
    ]);
    await connection.query("DELETE from Movie where MovieID=?", [body.MovieID]);
  } else {
    throw new HttpException(true, 200, "No such movie");
  }
};

const updateMovie = async (body) => {
  const schema = Joi.object().keys({
    Title: Joi.string().required(),
    ReleaseYear: Joi.number().required(),
    PosterImage: Joi.string().required(),
    Actors: Joi.array().required(),
    Director: Joi.string().required(),
    MovieID: Joi.number().required(),
  });

  const result = schema.validate(body);

  if (result.error) {
    throw new HttpException(false, 400, result.error.details[0].message);
  } else {
    const connection = await connectToDatabase();
    const [rows] = await connection.query(
      "SELECT * FROM Movie where MovieID=?",
      [body.MovieID]
    );
    const movie = rows.length > 0 ? rows[0] : null;

    if (movie) {
      body.Actors = body.Actors.join(",");

      const values = [
        body.Title,
        body.ReleaseYear,
        body.PosterImage,
        body.Actors,
        body.Director,
        body.MovieID,
      ];

      await connection.query(
        "UPDATE Movie SET Title=?, ReleaseYear=?, PosterImage=?, Actors=?, Director=? where MovieID=?",
        values
      );
    } else {
      throw new HttpException(true, 200, "No such movie");
    }
  }
};

const searchMovie = async (body) => {
  const connection = await connectToDatabase();
  // const q = `SELECT * FROM Movie where Title LIKE '%${body.keyword}%' OR ReleaseYear LIKE '%${body.keyword}%' OR Actors LIKE '%${body.keyword}%' OR Director LIKE '%${body.keyword}%';`;
  const q = `SELECT Movie.*, ROUND(AVG(Review.Rating)) AS AvgRating FROM Movie LEFT JOIN Review ON Movie.MovieID = Review.MovieID WHERE Movie.Title LIKE '%${body.keyword}%' OR Movie.ReleaseYear LIKE '%${body.keyword}%' OR Movie.Actors LIKE '%${body.keyword}%' OR Movie.Director LIKE '%${body.keyword}%' GROUP BY Movie.MovieID;`;
  const [rows] = await connection.query(q);
  return rows;
};

module.exports = {
  addMovie,
  getAllMovies,
  getMovie,
  deleteMovie,
  updateMovie,
  searchMovie,
};
