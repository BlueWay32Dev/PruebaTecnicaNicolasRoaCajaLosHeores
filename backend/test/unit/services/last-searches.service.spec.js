"use strict";

const { ServiceBroker } = require("moleculer");
const LastSearchesService = require("../../../services/last-searches.service");

describe("Test 'last-searches' service", () => {
  const broker = new ServiceBroker({ logger: false });
  const service = broker.createService(LastSearchesService);

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  beforeEach(() => {
    service.recentSearches = [];
  });

  it("should add a new search term to the beginning", async () => {
    await broker.call("last-searches.add", { term: "dune" });
    const searches = await broker.call("last-searches.list");
    expect(searches).toEqual(["dune"]);
  });

  it("should move an existing term to the beginning", async () => {
    await broker.call("last-searches.add", { term: "dune" });
    await broker.call("last-searches.add", { term: "asimov" });
    await broker.call("last-searches.add", { term: "dune" });
    const searches = await broker.call("last-searches.list");
    expect(searches).toEqual(["dune", "asimov"]);
  });

  it("should not store more than 5 terms", async () => {
    for (let i = 1; i <= 6; i++) {
      await broker.call("last-searches.add", { term: `book ${i}` });
    }
    const searches = await broker.call("last-searches.list");
    expect(searches.length).toBe(5);
    expect(searches[0]).toBe("book 6");
    expect(searches[4]).toBe("book 2");
  });

  it("should handle terms in a case-insensitive way and trim whitespace", async () => {
    await broker.call("last-searches.add", { term: "  Dune  " });
    await broker.call("last-searches.add", { term: "dune" });
    const searches = await broker.call("last-searches.list");
    expect(searches.length).toBe(1);
    expect(searches[0]).toBe("dune");
  });
});
