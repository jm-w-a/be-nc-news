const app = require("../db/app");
const db = require("../db/connection");

const fs = require("fs/promises");
const seed = require ("../db/seeds/seed");
const {articleData, commentData, topicData, userData} = require("../db/data/test-data/index");
const { getEndpointDescription } = require("../db/controllers/app.controllers");

const request = require("supertest");
const { getEndpointDescription } = require("../db/controllers/app.controllers");

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
