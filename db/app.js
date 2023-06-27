const express = require("express");
const app = express();
const db = require("../db/connection");
const seed = require ("../db/seeds/seed");
const { articleData, commentData, topicData, userData } = require("../db/data/test-data/index");
const { getEndpointDescription, getAllTopics, getArticleById } = require("../db/controllers/app.controllers");

app.get("/api/", getEndpointDescription);
app.get("/api/topics", getAllTopics);
app.get("/api/articles/:article_id", getArticleById);

module.exports = app;