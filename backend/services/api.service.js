"use strict";

const ApiGateway = require("moleculer-web");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
  name: "api",
  mixins: [ApiGateway],

  settings: {
    port: process.env.PORT || 3000,
    routes: [
      {
        path: "/api",
        authorization: true,
        cors: {
          origin: ["http://localhost:3001", "http://127.0.0.1:3001"],
          methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
          allowedHeaders: ["Content-Type", "Authorization"],
          credentials: true,
          maxAge: 3600,
        },
        bodyParsers: {
          json: true,
          urlencoded: { extended: true },
        },
        onAfterCall(ctx, route, req, res, data) {
          if (
            ctx.action &&
            ctx.action.name === "library.remove" &&
            res.statusCode < 400
          ) {
            res.writeHead(204);
            res.end();
            return;
          }
          return data;
        },
        aliases: {
          "POST /auth/login": "auth.login",
          "POST /auth/register": "auth.register",

          "POST /books/my-library": "library.create",
          "GET /books/my-library": "library.list",
          "GET /books/my-library/:id": "library.get",
          "PUT /books/my-library/:id": "library.update",
          "DELETE /books/my-library/:id": "library.remove",
          "GET /books/my-library/front-cover/:id": "library.frontCover",

          "GET /books/search": "books.search",
          "GET /books/last-search": "last-searches.list",
          "GET /books/:id": "books.get",
        },
      },
    ],
  },

  methods: {
    async authorize(ctx, route, req) {
      const open = [
        req.method === "POST" && req.url === "/auth/login",
        req.method === "POST" && req.url === "/auth/register",
      ].some(Boolean);
      if (open) return;

      let token;
      if (req.headers.authorization) {
        const [type, t] = req.headers.authorization.split(" ");
        if (type === "Bearer" || type === "Token") token = t;
      }

      if (!token) {
        throw new MoleculerError("Se requiere autenticación.", 401, "NO_TOKEN");
      }

      try {
        const decoded = await ctx.call("auth.verifyToken", { token });
        ctx.meta.user = decoded;
      } catch (e) {
        throw new MoleculerError("Token inválido.", 401, "INVALID_TOKEN");
      }
    },
  },
};
