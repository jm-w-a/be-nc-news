const app = require("../app");
const db = require("../db/connection");

const fs = require("fs/promises");
const seed = require ("../db/seeds/seed");
const {articleData, commentData, topicData, userData} = require("../db/data/test-data/index");
const { getEndpointDescription } = require("../controllers/app.controllers");

const request = require("supertest");
require('jest-sorted');


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
describe("GET - All topics:", ()=> {
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
});
describe("GET - All articles:", ()=> {
  test("200: Responds with an articles array of article objects - without the body property:", () => {
    return request(app)
    .get("/api/articles?sort_by=created_at")
    .expect(200)
    .then(({body})=>{
      const { articles } = body;
      expect(articles).toHaveLength(13);
      articles.forEach((article)=>{
        expect(article).toHaveProperty("article_id", expect.any(Number));
        expect(article).toHaveProperty("author", expect.any(String));
        expect(article).toHaveProperty("title", expect.any(String));
        expect(article).toHaveProperty("topic", expect.any(String));
        expect(article).toHaveProperty("created_at", expect.any(String));
        expect(article).toHaveProperty("votes", expect.any(Number));
        expect(article).toHaveProperty("article_img_url", expect.any(String));
        expect(article).toHaveProperty("comment_count", expect.any(Number));

        expect(articles).toBeSortedBy("created_at", {descending: true});
      })
    })
  });
});
describe("GET - Article by article_id:", ()=> {
  test("200: Responds with an article object (article_id = 1), which should have author, title, article_id, body, topic, created_at, votes, and article_img_url:", () => {
    return request(app)
    .get("/api/articles/1")
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
    .get("/api/articles/1") 
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
    .get("/api/articles/1000")
    .expect(404)
    .then(({body})=>{
      const { msg } = body;
      expect(msg).toBe("Not found");
    })
  });
  test("400: Responds with 'Bad request' when passed a invalid api request:", () => {
    return request(app)
    .get("/api/articles/badrequest") 
    .expect(400)
    .then(({body})=>{
      const { msg } = body;

      expect(msg).toBe("Bad request");
    })
  });
});
describe("GET - All Comments by article_id:", ()=> {
  test("200: Responds with an array of comments for the given article_id, in descending order:", () => {
    return request(app)
    .get("/api/articles/3/comments")
    .expect(200)
    .then(({body})=>{
      const { comments } = body;
      expect(comments).toHaveLength(2);
      comments.forEach((comment)=>{
        expect(comment).toHaveProperty("comment_id", expect.any(Number));
        expect(comment).toHaveProperty("votes", expect.any(Number));
        expect(comment).toHaveProperty("created_at", expect.any(String));
        expect(comment).toHaveProperty("author", expect.any(String));
        expect(comment).toHaveProperty("body", expect.any(String));
        expect(comment).toHaveProperty("article_id", expect.any(Number)); 

        expect(comments).toBeSortedBy("created_at", {descending: true});
      })
    })
  });
  test("404: Responds with 'Not found' when passed a valid api request which does not exist yet:", () => {
    return request(app)
    .get("/api/articles/1000/comments")
    .expect(404)
    .then(({body})=>{
      const { msg } = body;
      expect(msg).toBe("Not found");
    })
  });
  test("400: Responds with 'Bad request' when passed a invalid api request:", () => {
    return request(app)
    .get("/api/articles/badrequest/comments") 
    .expect(400)
    .then(({body})=>{
      const { msg } = body;

      expect(msg).toBe("Bad request");
    })
  });
});
describe("POST - A comment to given article_id:", ()=> {
  test("201: Responds with the posted comment - with correct properties:", () => {
    const testComment = {
      username: "butter_bridge",
      body: "Hello. This is a test..."
    }

    return request(app)
    .post("/api/articles/1/comments")
    .send(testComment)
    .expect(201)
    .then(({body})=>{

      const { postedComment } = body;
      expect(postedComment).toHaveProperty("author", expect.any(String));
      expect(postedComment).toHaveProperty("body", expect.any(String));
      expect(postedComment).toHaveProperty("article_id", expect.any(Number));
    })
  });
  test("404: Responds with 'Not found' when trying to post to an article_id that doesn't exist:", () => {
    const testComment = {
      username: "butter_bridge",
      body: "Hello. This is a test..."
    }

    return request(app)
    .post("/api/articles/10000/comments")
    .send(testComment)
    .expect(404)
    .then(({body})=>{

      const { msg } = body;
      expect(msg).toBe("Not found");
    })
  });
  test("404: Responds with 'Not found' when given a none existent username:", () => {
    const testComment = {
      username: "buter_bridge",
      body: "Hello. This is a test..."
    }
    
    return request(app)
    .post("/api/articles/1/comment") 
    .send(testComment)
    .expect(404)
    .then(({body})=>{

      const { msg } = body;

      expect(msg).toBe("Not found");
    })
  });
  test("400: Responds with 'Bad request' when passed a invalid api request:", () => {
    const testComment = {
      username: "butter_bridge",
      body: "Hello. This is a test..."
    }
    
    return request(app)
    .post("/api/articles/badrequest/comments") 
    .send(testComment)
    .expect(400)
    .then(({body})=>{

      const { msg } = body;

      expect(msg).toBe("Bad request");
    })
  });
});
describe("PATCH - An article by id:", ()=> {
  test("200: Responds with the updated article object, with inc_votes increased by 1:", () => {
    const testPatch = {
      inc_votes: 1,
    }

    return request(app)
    .patch("/api/articles/1")
    .send(testPatch)
    .expect(200)
    .then(({body})=>{

      const { patchedArticle } = body;
      expect(patchedArticle).toHaveProperty("votes", expect.any(Number));
      expect(patchedArticle).toHaveProperty("article_id", expect.any(Number));
      expect(patchedArticle.votes).toBe(101)
    })
  });
  test("200: Responds with the updated article object, with inc_votes increased by 2:", () => {
    const testPatch = {
      inc_votes: 2,
    }

    return request(app)
    .patch("/api/articles/1")
    .send(testPatch)
    .expect(200)
    .then(({body})=>{

      const { patchedArticle } = body;
      expect(patchedArticle).toHaveProperty("votes", expect.any(Number));
      expect(patchedArticle).toHaveProperty("article_id", expect.any(Number));
      expect(patchedArticle.votes).toBe(102)
    })
  });
  test("200: Responds with the updated article object, with inc_votes increased by -1:", () => {
    const testPatch = {
      inc_votes: -1,
    }

    return request(app)
    .patch("/api/articles/1")
    .send(testPatch)
    .expect(200)
    .then(({body})=>{

      const { patchedArticle } = body;
      expect(patchedArticle).toHaveProperty("votes", expect.any(Number));
      expect(patchedArticle).toHaveProperty("article_id", expect.any(Number));
      expect(patchedArticle.votes).toBe(99)
    })
  });
  test("200: Responds with the updated article object, with inc_votes increased by -100:", () => {
    const testPatch = {
      inc_votes: -1,
    }

    return request(app)
    .patch("/api/articles/1")
    .send(testPatch)
    .expect(200)
    .then(({body})=>{

      const { patchedArticle } = body;
      expect(patchedArticle).toHaveProperty("votes", expect.any(Number));
      expect(patchedArticle).toHaveProperty("article_id", expect.any(Number));
      expect(patchedArticle.votes).toBe(0)
    })
  });
  test("200: Responds with the updated article object, with inc_votes increased by -101:", () => {
    const testPatch = {
      inc_votes: -1,
    }

    return request(app)
    .patch("/api/articles/1")
    .send(testPatch)
    .expect(200)
    .then(({body})=>{

      const { patchedArticle } = body;
      expect(patchedArticle).toHaveProperty("votes", expect.any(Number));
      expect(patchedArticle).toHaveProperty("article_id", expect.any(Number));
      expect(patchedArticle.votes).toBe(-1)
    })
  });
  test("404: Responds with 'Not found' when trying to update a non existent article:", () => {
    const testPatch = {
      inc_votes: 1,
    }

    return request(app)
    .patch("/api/articles/10000")
    .send(testPatch)
    .expect(404)
    .then(({body})=>{

      const { msg } = body;
      expect(msg).toBe("Not found");
    })
  });
  test("404: Responds with 'Not found' when trying to post on correct article_id, but wrong api path:", () => {
    const testPatch = {
      inc_votes: 1,
    }

    return request(app)
    .patch("/api/article/1")
    .send(testPatch)
    .expect(404)
    .then(({body})=>{

      const { msg } = body;
      expect(msg).toBe("Not found");
    })
  });
  test.only("400: Responds with 'Bad request' when passed a invalid api request:", () => {
    const testPatch = {
      inc_votes: 1,
    }

    return request(app)
    .patch("/api/articles/badrequest")
    .send(testPatch)
    .expect(400)
    .then(({body})=>{

      const { msg } = body;
      expect(msg).toBe("Bad request");
    })
  });
});
describe("DELETE - A comment by comment_id:", ()=> {
  test("204: Responds with no content:", () => {
    return request(app)
    .delete("/api/comments/1")
    .expect(204)
    .then(({body})=>{
      expect(body.length).toBe(undefined);
    })
  });
  test("400: Responds with 'Bad request' when passed a invalid api request:", () => {
    return request(app)
    .delete("/api/comments/badrequest")
    .expect(400)
    .then(({body})=>{

      const { msg } = body;
      expect(msg).toBe("Bad request");
    })
  });
});
describe("GET - All users:", ()=> {
  test("200: Responds with an users array of user objects:", () => {
    return request(app)
    .get("/api/users")
    .expect(200)
    .then(({body})=>{
      const { users } = body;
      expect(users).toHaveLength(4);
      users.forEach((user)=>{
        expect(user).toHaveProperty("username", expect.any(String));
        expect(user).toHaveProperty("name", expect.any(String));
        expect(user).toHaveProperty("avatar_url", expect.any(String));
      })
    })
  });
});