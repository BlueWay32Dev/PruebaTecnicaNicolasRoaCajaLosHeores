"use strict";

const DbService = require("moleculer-db");
const MongoAdapter = require("moleculer-db-adapter-mongo");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  name: "auth",
  mixins: [DbService],

  adapter: new MongoAdapter(
    process.env.MONGO_URI || "mongodb://localhost/booksapp"
  ),
  collection: "users",

  actions: {
    async register(ctx) {
      const { username, password } = ctx.params;

      if (!username || !password) {
        throw new Error("Usuario y contraseña son requeridos");
      }

      const existing = await this.adapter.findOne({ username });
      if (existing) {
        throw new Error("El usuario ya existe");
      }

      const hash = await bcrypt.hash(password, 10);
      const user = await this.adapter.insert({
        username,
        password: hash,
        createdAt: new Date(),
      });

      return { id: user._id, username: user.username };
    },

    async login(ctx) {
      const { username, password } = ctx.params;
      const user = await this.adapter.findOne({ username });

      if (!user) throw new Error("Usuario no encontrado");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Contraseña incorrecta");

      const token = jwt.sign(
        { id: user._id, username },
        process.env.JWT_SECRET || "secret",
        {
          expiresIn: "1h",
        }
      );

      return { token };
    },

    async verifyToken(ctx) {
      try {
        const decoded = jwt.verify(
          ctx.params.token,
          process.env.JWT_SECRET || "secret"
        );
        return decoded;
      } catch (err) {
        throw new Error("Token inválido");
      }
    },
  },
};
