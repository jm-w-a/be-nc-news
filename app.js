const express = require("express");
const app = express();
const db = require("./db/connection");
const seed = require("./db/seeds/seed");
const cors = require('cors');
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("./db/data/test-data/index");
const {
  getEndpointDescription,
  getAllTopics,
  getAllArticles,
  getArticleById,
  getAllArticleCommentsById,
  postArticleIdComment
} = require("./controllers/app.controllers");
const {
  handlePsqlErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./db/errors");

app.use(cors());
app.use(express.json());

app.get("/api/", getEndpointDescription);
app.get("/api/topics", getAllTopics);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getAllArticleCommentsById);

app.post("/api/articles/:article_id/comments", postArticleIdComment);

app.all("*", (_,res) => {
  res.status(404).send({msg:"Not found"});
});

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
