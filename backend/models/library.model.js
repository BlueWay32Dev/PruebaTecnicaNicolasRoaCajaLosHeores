"use strict";

const mongoose = require("mongoose");

const LibrarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookId: { type: String, required: true },
    title: { type: String, required: true },
    authors: [{ type: String }],
    publishYear: { type: Number },
    cover: { type: String, required: true },
    review: { type: String, maxlength: 500 },
    rating: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Library", LibrarySchema);
