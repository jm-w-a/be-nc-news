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
    test("200: Responds with an topics array of topic objects:", () => {
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
describe("GET - Article by article_id:", ()=> {
  test("200: Responds with an article object (article_id = 1), which should have author, title, article_id, body, topic, created_at, votes, and article_img_url:", () => {
    return request(app)
    .get("/api/articles/1") // Testing to get errors currently...
    .expect(200)
    .then(({body})=>{
      const { article } = body;

      expect(article).toHaveProperty("article_id", expect.any(Number));
      expect(article).toHaveProperty("author", expect.any(String));
      expect(article).toHaveProperty("title", expect.any(String));
      expect(article).toHaveProperty("body", expect.any(String));
      expect(article).toHaveProperty("topic", expect.any(String));
      expect(article).toHaveProperty("created_at", expect.any(String));
      expect(article).toHaveProperty("votes", expect.any(Number));
      expect(article).toHaveProperty("article_img_url", expect.any(String));
    })
  });
  test("200: Responds with an article object (article_id = 1), with correct content inside response:", () => {
    return request(app)
    .get("/api/articles/1") // Testing to get errors currently...
    .expect(200)
    .then(({body})=>{
      const { article } = body;

      expect(article.article_id).toBe(1);
      expect(article.title).toBe("Living in the shadow of a great man");
      expect(article.topic).toBe("mitch");
      expect(article.author).toBe("butter_bridge");
      expect(article.body).toBe("I find this existence challenging");
      expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
      expect(article.votes).toBe(100);
      expect(article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
    })
  });
  test("404: Responds with 'Not found' when passed a valid api request which does not exist yet:", () => {
    return request(app)
    .get("/api/articles/1000") // Testing to get errors currently...
    .expect(404)
    .then(({body})=>{
      const { msg } = body;
      expect(msg).toBe("Not found");
    })
  });
  test("400: Responds with 'Bad request' when passed a invalid api request:", () => {
    return request(app)
    .get("/api/articles/nonsense") // Testing to get errors currently...
    .expect(400)
    .then(({body})=>{
      const { msg } = body;

      expect(msg).toBe("Bad request");
    })
  });
})