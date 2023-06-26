// Setup:
const express = require("express");
const app = express();
const db = require("../db/connection");
const seed = require ("../db/seeds/seed");
const { articleData, commentData, topicData, userData } = require("../db/data/test-data/index");
const { getAllTopics } = require("../db/controllers/app.controllers");

// Requests:
app.get("/api/topics", getAllTopics);

// Exports:
module.exports = app;