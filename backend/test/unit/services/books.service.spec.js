"use strict";

const { ServiceBroker } = require("moleculer");
const { MoleculerError } = require("moleculer").Errors;
const BooksService = require("../../../services/books.service");
const axios = require("axios");

jest.mock("axios");

describe("Test 'books' service", () => {
  const broker = new ServiceBroker({ logger: false });
  broker.createService(BooksService);

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  const mockLibraryFindKeys = jest.fn();
  broker.createService({
    name: "library",
    actions: {
      findKeys: mockLibraryFindKeys,
    },
  });

  broker.createService({
    name: "last-searches",
    actions: {
      add: jest.fn(),
    },
  });

  beforeEach(() => {
    axios.get.mockClear();
    mockLibraryFindKeys.mockClear();
  });

  describe("Test 'books.search' action", () => {
    it("should return formatted books from OpenLibrary", async () => {
      const mockApiResponse = {
        data: {
          docs: [
            {
              key: "/works/OL1",
              title: "Book 1",
              author_name: ["Author 1"],
              first_publish_year: 2001,
              cover_i: 111,
            },
          ],
        },
      };
      axios.get.mockResolvedValue(mockApiResponse);
      mockLibraryFindKeys.mockResolvedValue([]);

      const result = await broker.call("books.search", { q: "book 1" });

      expect(result[0].title).toBe("Book 1");
      expect(result[0].coverUrl).toBe(
        `${process.env.OPEN_LIBRARY_COVERS_URL}/111-${process.env.OPEN_LIBRARY_COVERS_SIZE}`
      );
      expect(result[0].coverBase64).toBeUndefined();
    });

    it("should return local coverBase64 for books already in the library", async () => {
      const mockApiResponse = {
        data: {
          docs: [
            {
              key: "/works/OL1",
              title: "Book 1",
              author_name: ["Author 1"],
              first_publish_year: 2001,
              cover_i: 111,
            },
          ],
        },
      };
      axios.get.mockResolvedValue(mockApiResponse);

      const mockLibraryResponse = [
        {
          openLibraryKey: "/works/OL1",
          coverBase64: "data:image/png;base64,localcover",
        },
      ];
      mockLibraryFindKeys.mockResolvedValue(mockLibraryResponse);

      const result = await broker.call("books.search", { q: "book 1" });

      expect(result[0].title).toBe("Book 1");
      expect(result[0].coverUrl).toBeUndefined();
      expect(result[0].coverBase64).toBe("data:image/png;base64,localcover");
    });

    it("should throw a MoleculerError if the external API fails", async () => {
      axios.get.mockRejectedValue(new Error("Network Error"));
      await expect(broker.call("books.search", { q: "error" })).rejects.toThrow(
        MoleculerError
      );
    });
  });
});
