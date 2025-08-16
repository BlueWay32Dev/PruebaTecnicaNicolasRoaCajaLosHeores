"use strict";

const { ServiceBroker } = require("moleculer");
const LibraryService = require("../../../services/library.service");

describe("Test 'library' service", () => {
  const broker = new ServiceBroker({ logger: false });

  const mockBookModel = {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
  };
  broker.metadata.BookModel = function (data) {
    return {
      ...data,
      save: mockBookModel.save.mockResolvedValue({ ...data, _id: "mockId" }),
    };
  };
  Object.assign(broker.metadata.BookModel, mockBookModel);

  broker.createService(LibraryService);

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());
  beforeEach(() => jest.clearAllMocks());

  describe("Test 'library.list' action", () => {
    it("should call find with an empty query if no params are given", async () => {
      mockBookModel.find.mockResolvedValue([]);
      await broker.call("library.list", {});
      expect(mockBookModel.find).toHaveBeenCalledWith({});
    });

    it("should build a search query for title and authors", async () => {
      mockBookModel.find.mockResolvedValue([]);
      await broker.call("library.list", { search: "Dune" });
      const expectedQuery = {
        $or: [{ title: /Dune/i }, { authors: /Dune/i }],
      };
      expect(mockBookModel.find).toHaveBeenCalledWith(expectedQuery);
    });

    it("should build a query for books with reviews", async () => {
      mockBookModel.find.mockResolvedValue([]);
      await broker.call("library.list", { hasReview: true });
      const expectedQuery = {
        review: { $exists: true, $ne: null, $ne: "" },
      };
      expect(mockBookModel.find).toHaveBeenCalledWith(expectedQuery);
    });

    it("should combine search and hasReview filters", async () => {
      mockBookModel.find.mockResolvedValue([]);
      await broker.call("library.list", { search: "Dune", hasReview: true });
      const expectedQuery = {
        $or: [{ title: /Dune/i }, { authors: /Dune/i }],
        review: { $exists: true, $ne: null, $ne: "" },
      };
      expect(mockBookModel.find).toHaveBeenCalledWith(expectedQuery);
    });
  });

  describe("Test 'library.create' action", () => {
    const mockBookPayload = {
      title: "New Book",
      authors: ["Author"],
      rating: 5,
      coverBase64: "base64string",
      openLibraryKey: "key1",
    };

    it("should save a new book", async () => {
      mockBookModel.findOne.mockResolvedValue(null);
      const result = await broker.call("library.create", mockBookPayload);
      expect(result.title).toBe("New Book");
      expect(mockBookModel.save).toHaveBeenCalled();
    });

    it("should throw error if book exists", async () => {
      mockBookModel.findOne.mockResolvedValue({ title: "Existing Book" });
      await expect(
        broker.call("library.create", mockBookPayload)
      ).rejects.toThrow("Este libro ya está en tu biblioteca.");
    });
  });

  describe("Test 'library.get' action", () => {
    it("should return a book by apiId", async () => {
      mockBookModel.findOne.mockResolvedValue({
        apiId: "123",
        title: "Found Book",
      });
      const result = await broker.call("library.get", { id: "123" });
      expect(result.title).toBe("Found Book");
    });

    it("should throw error if book not found", async () => {
      mockBookModel.findOne.mockResolvedValue(null);
      await expect(broker.call("library.get", { id: "404" })).rejects.toThrow(
        "Libro no encontrado."
      );
    });
  });

  describe("Test 'library.update' action", () => {
    it("should update a book", async () => {
      mockBookModel.findOneAndUpdate.mockResolvedValue({
        apiId: "123",
        rating: 5,
      });
      const result = await broker.call("library.update", {
        id: "123",
        rating: 5,
      });
      expect(result.rating).toBe(5);
    });
  });

  describe("Test 'library.remove' action", () => {
    it("should remove a book", async () => {
      mockBookModel.findOneAndDelete.mockResolvedValue({ apiId: "123" });
      await expect(
        broker.call("library.remove", { id: "123" })
      ).resolves.toBeUndefined();
    });
  });

  describe("Test 'library.findKeys' action", () => {
    it("should find books by an array of keys", async () => {
      mockBookModel.find.mockResolvedValue([{ openLibraryKey: "key1" }]);
      const result = await broker.call("library.findKeys", {
        keys: ["key1", "key2"],
      });
      expect(result.length).toBe(1);
      expect(result[0].openLibraryKey).toBe("key1");
    });
  });
});
