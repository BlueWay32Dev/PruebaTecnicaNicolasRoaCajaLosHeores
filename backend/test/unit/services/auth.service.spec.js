"use strict";

const { ServiceBroker } = require("moleculer");
const { MoleculerError } = require("moleculer").Errors;
const AuthService = require("../../../services/auth.service");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

jest.mock("jsonwebtoken");
jest.mock("bcryptjs");

describe("Test 'auth' service", () => {
  const broker = new ServiceBroker({ logger: false });

  const mockUserModel = {
    findOne: jest.fn(),
    countDocuments: jest.fn().mockResolvedValue(1),
  };
  broker.metadata.UserModel = mockUserModel;

  broker.createService(AuthService);

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());
  beforeEach(() => jest.clearAllMocks());

  describe("Test 'auth.login' action", () => {
    it("should return a token for valid credentials", async () => {
      const mockUser = {
        _id: "userId123",
        username: "admin",
        comparePassword: jest.fn().mockResolvedValue(true),
      };
      mockUserModel.findOne.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue("fake.jwt.token");

      const result = await broker.call("auth.login", {
        username: "admin",
        password: "password",
      });
      expect(result.token).toBe("fake.jwt.token");
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ username: "admin" });
      expect(mockUser.comparePassword).toHaveBeenCalledWith("password");
    });

    it("should throw an error for a non-existent user", async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      await expect(
        broker.call("auth.login", { username: "nouser", password: "password" })
      ).rejects.toThrow(new MoleculerError("Credenciales inválidas.", 401));
    });

    it("should throw an error for an incorrect password", async () => {
      const mockUser = {
        comparePassword: jest.fn().mockResolvedValue(false),
      };
      mockUserModel.findOne.mockResolvedValue(mockUser);
      await expect(
        broker.call("auth.login", {
          username: "admin",
          password: "wrongpassword",
        })
      ).rejects.toThrow(new MoleculerError("Credenciales inválidas.", 401));
    });
  });

  describe("Test 'auth.verifyToken' action", () => {
    it("should return the decoded payload for a valid token", async () => {
      const mockPayload = { id: "userId123", username: "admin" };
      jwt.verify.mockReturnValue(mockPayload);

      const result = await broker.call("auth.verifyToken", {
        token: "valid.token",
      });
      expect(result).toEqual(mockPayload);
      expect(jwt.verify).toHaveBeenCalledWith(
        "valid.token",
        expect.any(String)
      );
    });

    it("should throw an error for an invalid token", async () => {
      jwt.verify.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      await expect(
        broker.call("auth.verifyToken", { token: "invalid.token" })
      ).rejects.toThrow(new MoleculerError("Token inválido o expirado.", 401));
    });
  });
});
