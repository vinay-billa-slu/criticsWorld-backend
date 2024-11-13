// tests/User.test.js
const request = require("supertest");
const express = require("express");
const router = require("../routes/User"); // Import the router
const userController = require("../controllers/User"); // Import the controller to mock
const { verifyTokenAndAdmin, verifyToken } = require("../middleware/Auth");

jest.mock("../controllers/User", () => ({
  getAllUsers: jest.fn(),
  getUser: jest.fn(),
  deleteUser: jest.fn(),
  updateUser: jest.fn(),
}));

jest.mock("../middleware/Auth", () => ({
  verifyTokenAndAdmin: jest.fn((req, res, next) => next()),
  verifyToken: jest.fn((req, res, next) => next()),
}));

const app = express();
app.use(express.json());
app.use("/user", router);

describe("User Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /user/getAllUsers", () => {
    it("should return all users when called by an admin", async () => {
      const mockUsers = [{ id: 1, name: "User1" }, { id: 2, name: "User2" }];
      userController.getAllUsers.mockResolvedValue(mockUsers);

      const response = await request(app).post("/user/getAllUsers");
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockUsers);
      expect(response.body.total).toBe(mockUsers.length);
      expect(userController.getAllUsers).toHaveBeenCalled();
    });

    it("should handle errors from getAllUsers", async () => {
      userController.getAllUsers.mockRejectedValue(new Error("Database error"));

      const response = await request(app).post("/user/getAllUsers");
      
      expect(response.status).toBe(500); // Assuming error handling middleware sets 500
    });
  });

  describe("POST /user/getUser", () => {
    it("should return a single user by ID", async () => {
      const mockUser = { id: 1, name: "User1" };
      userController.getUser.mockResolvedValue(mockUser);

      const response = await request(app).post("/user/getUser").send({ id: 1 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockUser);
      expect(userController.getUser).toHaveBeenCalledWith({ id: 1 });
    });

    it("should handle errors from getUser", async () => {
      userController.getUser.mockRejectedValue(new Error("User not found"));

      const response = await request(app).post("/user/getUser").send({ id: 1 });
      
      expect(response.status).toBe(500);
    });
  });

  describe("POST /user/deleteUser", () => {
    it("should delete a user successfully", async () => {
      userController.deleteUser.mockResolvedValue();

      const response = await request(app).post("/user/deleteUser").send({ id: 1 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("User has been deleted");
      expect(userController.deleteUser).toHaveBeenCalledWith({ id: 1 });
    });

    it("should handle errors from deleteUser", async () => {
      userController.deleteUser.mockRejectedValue(new Error("Failed to delete user"));

      const response = await request(app).post("/user/deleteUser").send({ id: 1 });
      
      expect(response.status).toBe(500);
    });
  });

  describe("POST /user/updateUser", () => {
    it("should update a user successfully", async () => {
      const updatedUser = { id: 1, name: "Updated User" };
      userController.updateUser.mockResolvedValue(updatedUser);

      const response = await request(app).post("/user/updateUser").send(updatedUser);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("User has been updated");
      expect(response.body.data).toEqual(updatedUser);
      expect(userController.updateUser).toHaveBeenCalledWith(updatedUser);
    });

    it("should handle errors from updateUser", async () => {
      userController.updateUser.mockRejectedValue(new Error("Failed to update user"));

      const response = await request(app).post("/user/updateUser").send({ id: 1 });
      
      expect(response.status).toBe(500);
    });
  });
});
