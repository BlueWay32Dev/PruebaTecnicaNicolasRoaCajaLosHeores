"use strict";

const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    apiId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    authors: { type: [String], default: [] },
    publishYear: { type: Number, default: null },
    review: { type: String, maxlength: 500 },
    rating: { type: Number, min: 1, max: 5 },
    cover: { type: String, required: true },
    openLibraryKey: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", BookSchema);
