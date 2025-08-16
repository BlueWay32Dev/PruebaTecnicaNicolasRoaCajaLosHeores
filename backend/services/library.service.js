"use strict";

const { MoleculerError } = require("moleculer").Errors;
const crypto = require("crypto");
const axios = require("axios");

module.exports = {
  name: "library",

  actions: {
    list: {
      params: {
        search: { type: "string", optional: true },
        hasReview: { type: "boolean", convert: true, optional: true },
      },
      async handler(ctx) {
        const Book = ctx.broker.metadata.BookModel;
        const query = { userId: ctx.meta.user.id };

        if (ctx.params.search) {
          const searchRegex = new RegExp(ctx.params.search, "i");
          query.$or = [{ title: searchRegex }, { authors: searchRegex }];
        }

        if (ctx.params.hasReview === true) {
          query.review = { $exists: true, $ne: null, $ne: "" };
        }

        return await Book.find(query);
      },
    },

    findKeys: {
      visibility: "protected",
      params: { keys: { type: "array", items: "string" } },
      async handler(ctx) {
        const Book = ctx.broker.metadata.BookModel;
        return await Book.find({
          userId: ctx.meta.user.id,
          openLibraryKey: { $in: ctx.params.keys },
        });
      },
    },

    remove: {
      params: { id: "string" },
      async handler(ctx) {
        const Book = ctx.broker.metadata.BookModel;
        const User = ctx.broker.metadata.UserModel;

        const deletedBook = await Book.findOneAndDelete({
          apiId: ctx.params.id,
          userId: ctx.meta.user.id,
        });

        if (!deletedBook) {
          throw new MoleculerError(
            "Libro no encontrado para eliminar.",
            404,
            "NOT_FOUND"
          );
        }

        await User.findByIdAndUpdate(ctx.meta.user.id, {
          $pull: { library: deletedBook._id },
        });
      },
    },

    update: {
      params: {
        id: "string",
        review: { type: "string", max: 500, optional: true },
        rating: { type: "number", min: 1, max: 5, optional: true },
      },
      async handler(ctx) {
        const Book = ctx.broker.metadata.BookModel;
        const { id, review, rating } = ctx.params;

        const updateData = {};
        if (review !== undefined) updateData.review = review;
        if (rating !== undefined) updateData.rating = rating;

        if (Object.keys(updateData).length === 0) {
          return await Book.findOne({ apiId: id, userId: ctx.meta.user.id });
        }

        const updatedBook = await Book.findOneAndUpdate(
          { apiId: id, userId: ctx.meta.user.id },
          { $set: updateData },
          { new: true }
        );

        if (!updatedBook) {
          throw new MoleculerError(
            "Libro no encontrado para actualizar.",
            404,
            "NOT_FOUND"
          );
        }

        return updatedBook;
      },
    },

    get: {
      params: { id: "string" },
      async handler(ctx) {
        const Book = ctx.broker.metadata.BookModel;
        const book = await Book.findOne({
          apiId: ctx.params.id,
          userId: ctx.meta.user.id,
        });

        if (book) return book;
        throw new MoleculerError("Libro no encontrado.", 404, "NOT_FOUND");
      },
    },

    create: {
      params: {
        title: { type: "string" },
        authors: { type: "array", items: "string" },
        publishYear: { type: "number", optional: true },
        review: { type: "string", max: 500, optional: true },
        rating: { type: "number", min: 1, max: 5 },
        cover: { type: "string" },
        openLibraryKey: { type: "string" },
      },
      async handler(ctx) {
        const Book = ctx.broker.metadata.BookModel;
        const User = ctx.broker.metadata.UserModel;
        const userId = ctx.meta.user.id;

        const existingBook = await Book.findOne({
          userId,
          openLibraryKey: ctx.params.openLibraryKey,
        });
        if (existingBook) {
          throw new MoleculerError(
            "Este libro ya está en tu biblioteca.",
            409,
            "BOOK_EXISTS"
          );
        }

        let coverBase64 = "";
        if (ctx.params.cover.startsWith("http")) {
          const res = await axios.get(ctx.params.cover, {
            responseType: "arraybuffer",
          });
          const mimeType = res.headers["content-type"] || "image/jpeg";
          const b64 = Buffer.from(res.data).toString("base64");
          coverBase64 = `data:${mimeType};base64,${b64}`;
        } else {
          coverBase64 = ctx.params.cover;
        }

        const newBook = new Book({
          title: ctx.params.title,
          authors: ctx.params.authors,
          publishYear: ctx.params.publishYear,
          review: ctx.params.review,
          rating: ctx.params.rating,
          cover: coverBase64,
          openLibraryKey: ctx.params.openLibraryKey,
          apiId: crypto.randomUUID(),
          userId,
        });

        const savedBook = await newBook.save();
        await User.findByIdAndUpdate(userId, {
          $push: { library: savedBook._id },
        });

        return savedBook;
      },
    },

    frontCover: {
      params: { id: "string" },
      async handler(ctx) {
        const Book = ctx.broker.metadata.BookModel;
        const book = await Book.findOne({
          apiId: ctx.params.id,
          userId: ctx.meta.user.id,
        });
        if (!book) {
          throw new MoleculerError("Portada no encontrada.", 404, "NOT_FOUND");
        }

        const base64 = book.cover.includes(",")
          ? book.cover.split(",")[1]
          : book.cover;
        const buf = Buffer.from(base64, "base64");
        ctx.meta.$responseType = "image/jpeg";
        ctx.meta.$responseHeaders = {
          "Cache-Control": "public, max-age=31536000",
        };
        return buf;
      },
    },
  },
};
