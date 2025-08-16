"use strict";

module.exports = {
  name: "last-searches",
  created() {
    this.recentSearches = [];
  },

  actions: {
    list() {
      return this.recentSearches;
    },
    add: {
      params: {
        term: { type: "string", min: 1 },
      },
      handler(ctx) {
        const searchTerm = ctx.params.term.trim().toLowerCase();
        this.recentSearches = this.recentSearches.filter(
          (t) => t !== searchTerm
        );
        this.recentSearches.unshift(searchTerm);
        this.recentSearches = this.recentSearches.slice(0, 5);
        this.broker.logger.info(
          "Historial de búsqueda actualizado:",
          this.recentSearches
        );
      },
    },
  },
};
