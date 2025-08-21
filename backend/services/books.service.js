"use strict";

const axios = require("axios");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
  name: "books",

  actions: {
    search: {
      params: { q: { type: "string", min: 1 } },
      async handler(ctx) {
        try {
          const q = ctx.params.q.trim();
          const url = `${
            process.env.OPEN_LIBRARY_URL
          }/search.json?q=${encodeURIComponent(q)}&limit=10`;
          const { data } = await axios.get(url);

          return (data.docs || []).map((doc) => ({
            id: (doc.key || "").replace("/works/", ""),
            title: doc.title,
            authors: doc.author_name || [],
            publishYear: doc.first_publish_year || null,
            cover: doc.cover_i
              ? `${process.env.OPEN_LIBRARY_COVERS_URL}/${doc.cover_i}-M.jpg`
              : "https://placehold.co/250x250?text=no+foto",
            openLibraryKey: (doc.key || "").replace("/works/", ""),
          }));
        } catch (err) {
          throw new MoleculerError(
            "Error buscando libros.",
            500,
            "SEARCH_ERROR",
            {
              originalError: err.message,
            }
          );
        }
      },
    },

    get: {
      params: { id: "string" },
      async handler(ctx) {
        try {
          const workUrl = `${process.env.OPEN_LIBRARY_URL}/works/${ctx.params.id}.json`;
          const { data } = await axios.get(workUrl);

          const authorNames = await Promise.all(
            (data.authors || []).map(async (a) => {
              try {
                const res = await axios.get(
                  `${process.env.OPEN_LIBRARY_URL}${a?.author?.key}.json`
                );
                return res.data?.name || "Autor desconocido";
              } catch {
                return "Autor desconocido";
              }
            })
          );

          const year = (data.first_publish_date?.match(/\d{4}/) ||
            data.created?.value?.match(/\d{4}/) || [null])[0];

          const cover = data.covers?.length
  ? data.covers[0] !== -1 
    ? `${process.env.OPEN_LIBRARY_COVERS_URL}/${data.covers[0]}-${process.env.OPEN_LIBRARY_COVERS_SIZE}`
    : data.covers[1] 
      ? `${process.env.OPEN_LIBRARY_COVERS_URL}/${data.covers[1]}-${process.env.OPEN_LIBRARY_COVERS_SIZE}`
      : "https://placehold.co/250x250?text=no+foto"
  : "https://placehold.co/250x250?text=no+foto";

          return {
            id: ctx.params.id,
            title: data.title,
            authors: authorNames,
            publishYear: year ? parseInt(year) : null,
            subjects: data.subjects || [],
            cover,
          };
        } catch (err) {
          throw new MoleculerError(
            "Error obteniendo detalle del libro.",
            500,
            "GET_ERROR",
            {
              originalError: err.message,
            }
          );
        }
      },
    },
  },
};
