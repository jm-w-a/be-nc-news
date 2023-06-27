const app = require("../db/app");
const db = require("../db/connection");

const fs = require("fs/promises");
const seed = require ("../db/seeds/seed");
const {articleData, commentData, topicData, userData} = require("../db/data/test-data/index");
const { getEndpointDescription } = require("../db/controllers/app.controllers");

const request = require("supertest");

beforeEach(()=>{
    return seed({articleData, commentData, topicData, userData}); 
});
afterAll(()=>{ 
    db.end();
});

describe("GET - All descriptions of all endpoints:", () => {
  test("Should return an object:", () => {
    return request(app)
      .get("/api/")
      .expect(200)
      .then(({body})=>{
        expect(typeof body).toBe('object');
      })
  });
  test("200: Responds with an object describing all the available endpoints on your API:", () => {
    return request(app)
      .get("/api/")
      .expect(200)
      .then(({body})=>{
        return Promise.all([fs.readFile(`${__dirname}/../endpoints.json`, 'utf8'), body])
      }).then(([fileOutput, body])=>{
        expect(body.endPoints).toEqual(JSON.parse(fileOutput));
      })
  });
});
describe("GET - All articles:", ()=> {
    test("200: Responds with an array of all topics in topics:", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body})=>{
          expect(body.topics).toHaveLength(3);
          body.topics.forEach((topic)=>{
            expect(topic).toHaveProperty("slug", expect.any(String));
            expect(topic).toHaveProperty("description", expect.any(String));
          })
        })
    });
})
describe("GET - Article by ID:", ()=> {
  test("200: Responds with an article object (article_id = 1), which should have author, title, article_id, body, topic, created_at, votes, and article_img_url:", () => {
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then(({body})=>{
        expect(body.article).toHaveProperty("article_id", expect.any(Number));
        expect(body.article).toHaveProperty("author", expect.any(String));
        expect(body.article).toHaveProperty("title", expect.any(String));
        expect(body.article).toHaveProperty("body", expect.any(String));
        expect(body.article).toHaveProperty("topic", expect.any(String));
        expect(body.article).toHaveProperty("created_at", expect.any(String));
        expect(body.article).toHaveProperty("votes", expect.any(Number));
        expect(body.article).toHaveProperty("article_img_url", expect.any(String));
    })
  });
  test("200: Responds with an article object (article_id = 2), which should have author, title, article_id, body, topic, created_at, votes, and article_img_url:", () => {
    return request(app)
    .get("/api/articles/2")
    .expect(200)
    .then(({body})=>{
        expect(body.article).toHaveProperty("article_id", expect.any(Number));
        expect(body.article).toHaveProperty("author", expect.any(String));
        expect(body.article).toHaveProperty("title", expect.any(String));
        expect(body.article).toHaveProperty("body", expect.any(String));
        expect(body.article).toHaveProperty("topic", expect.any(String));
        expect(body.article).toHaveProperty("created_at", expect.any(String));
        expect(body.article).toHaveProperty("votes", expect.any(Number));
        expect(body.article).toHaveProperty("article_img_url", expect.any(String));
    })
  });
})