"use strict";

require("dotenv").config();
const mongoose = require("mongoose");

module.exports = {
  namespace: "book-reviews",
  logger: true,
  logLevel: "info",

  created(broker) {
    broker.logger.info("Broker iniciando conexión a MongoDB...");
    mongoose.connection.on("connected", () => {
      broker.logger.info("Conexión con MongoDB establecida.");
    });
    mongoose.connection.on("error", (err) => {
      broker.logger.error(`Error de conexión con MongoDB: ${err.message}`);
    });
    mongoose.connect(process.env.MONGO_URI);

    broker.metadata.BookModel = require("./models/book.model");
    broker.metadata.UserModel = require("./models/user.model");
  },

  stopped(broker) {
    mongoose.disconnect().then(() => {
      broker.logger.info("Conexión con MongoDB cerrada.");
    });
  },
};
