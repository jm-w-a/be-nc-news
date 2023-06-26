const app = require("../db/app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index");
const request = require("supertest");
const { getEndpointDescription } = require("../db/controllers/app.controllers");

beforeEach(() => {
  return seed({ articleData, commentData, topicData, userData });
});
afterAll(() => {
  db.end();
});

describe("GET - All articles:", () => {
  test("200: Responds with an array of all topics in topics:", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toHaveLength(3);
        body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
        });
      });
  });
});
