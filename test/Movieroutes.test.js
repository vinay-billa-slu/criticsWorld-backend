// tests/Movie.test.js
const request = require("supertest");
const express = require("express");
const router = require("../routes/Movie"); // Import the router
const movieController = require("../controllers/Movie"); // Import the controller to mock
const { verifyTokenAndAdmin, verifyToken } = require("../middleware/Auth");

jest.mock("../controllers/Movie", () => ({
  addMovie: jest.fn(),
  getAllMovies: jest.fn(),
  getMovie: jest.fn(),
  deleteMovie: jest.fn(),
  updateMovie: jest.fn(),
  searchMovie: jest.fn(),
}));

jest.mock("../middleware/Auth", () => ({
  verifyTokenAndAdmin: jest.fn((req, res, next) => next()),
  verifyToken: jest.fn((req, res, next) => next()),
}));

const app = express();
app.use(express.json());
app.use("/movie", router);

describe("Movie Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /movie/addMovie", () => {
    it("should add a movie successfully", async () => {
      movieController.addMovie.mockResolvedValue();

      const response = await request(app).post("/movie/addMovie").send({ title: "Inception" });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Movie Added");
      expect(movieController.addMovie).toHaveBeenCalledWith({ title: "Inception" });
    });

    it("should handle errors when adding a movie", async () => {
      movieController.addMovie.mockRejectedValue(new Error("Database error"));

      const response = await request(app).post("/movie/addMovie").send({ title: "Inception" });
      
      expect(response.status).toBe(500);
    });
  });

  describe("POST /movie/getAllMovies", () => {
    it("should return all movies", async () => {
      const mockMovies = [{ id: 1, title: "Inception" }, { id: 2, title: "Interstellar" }];
      movieController.getAllMovies.mockResolvedValue(mockMovies);

      const response = await request(app).post("/movie/getAllMovies");
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockMovies);
      expect(response.body.total).toBe(mockMovies.length);
      expect(movieController.getAllMovies).toHaveBeenCalled();
    });

    it("should handle errors from getAllMovies", async () => {
      movieController.getAllMovies.mockRejectedValue(new Error("Database error"));

      const response = await request(app).post("/movie/getAllMovies");
      
      expect(response.status).toBe(500);
    });
  });

  describe("POST /movie/getMovie", () => {
    it("should return a single movie by ID", async () => {
      const mockMovie = { id: 1, title: "Inception" };
      movieController.getMovie.mockResolvedValue(mockMovie);

      const response = await request(app).post("/movie/getMovie").send({ id: 1 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockMovie);
      expect(movieController.getMovie).toHaveBeenCalledWith({ id: 1 });
    });

    it("should handle errors from getMovie", async () => {
      movieController.getMovie.mockRejectedValue(new Error("Movie not found"));

      const response = await request(app).post("/movie/getMovie").send({ id: 1 });
      
      expect(response.status).toBe(500);
    });
  });

  describe("POST /movie/deleteMovie", () => {
    it("should delete a movie successfully", async () => {
      movieController.deleteMovie.mockResolvedValue();

      const response = await request(app).post("/movie/deleteMovie").send({ id: 1 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Movie has been deleted");
      expect(movieController.deleteMovie).toHaveBeenCalledWith({ id: 1 });
    });

    it("should handle errors from deleteMovie", async () => {
      movieController.deleteMovie.mockRejectedValue(new Error("Failed to delete movie"));

      const response = await request(app).post("/movie/deleteMovie").send({ id: 1 });
      
      expect(response.status).toBe(500);
    });
  });

  describe("POST /movie/updateMovie", () => {
    it("should update a movie successfully", async () => {
      const updatedMovie = { id: 1, title: "Updated Inception" };
      movieController.updateMovie.mockResolvedValue(updatedMovie);

      const response = await request(app).post("/movie/updateMovie").send(updatedMovie);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Movie has been updated");
      expect(response.body.data).toEqual(updatedMovie);
      expect(movieController.updateMovie).toHaveBeenCalledWith(updatedMovie);
    });

    it("should handle errors from updateMovie", async () => {
      movieController.updateMovie.mockRejectedValue(new Error("Failed to update movie"));

      const response = await request(app).post("/movie/updateMovie").send({ id: 1 });
      
      expect(response.status).toBe(500);
    });
  });

  describe("POST /movie/searchMovie", () => {
    it("should return search results for a movie", async () => {
      const searchResult = [{ id: 1, title: "Inception" }];
      movieController.searchMovie.mockResolvedValue(searchResult);

      const response = await request(app).post("/movie/searchMovie").send({ title: "Inception" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Movie's listed");
      expect(response.body.data).toEqual(searchResult);
      expect(movieController.searchMovie).toHaveBeenCalledWith({ title: "Inception" });
    });

    it("should handle errors from searchMovie", async () => {
      movieController.searchMovie.mockRejectedValue(new Error("Failed to search movie"));

      const response = await request(app).post("/movie/searchMovie").send({ title: "Inception" });
      
      expect(response.status).toBe(500);
    });
  });
});
