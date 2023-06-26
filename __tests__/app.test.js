// Setup:
const app = require("../db/app");
const db = require("../db/connection");
const seed = require ("../db/seeds/seed");
const {articleData, commentData, topicData, userData} = require("../db/data/test-data/index");
const request = require("supertest");

// Needed for test ENV:
beforeEach(()=>{
    // Re-seeds the DB.
    return seed({articleData, commentData, topicData, userData}); // find out how to do all data?
});
afterAll(()=>{ 
    // Stop hanging.
    db.end();
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
