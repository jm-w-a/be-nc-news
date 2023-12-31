const db = require("../db/connection");

exports.selectAllTopics = () =>{
  let query = "SELECT * FROM topics";

  return db
    .query(query)
    .then(({rows})=>{
        return rows;
    });
}
exports.selectAllArticles = (sort_by = "created_at") => {
  const validSortBy = ["created_at"];

  if(!validSortBy.includes(sort_by)){
    return Promise.reject({status : 400, msg : "Bad request"});
  }  

  let query = "SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST (COUNT (comment_id) AS INT) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ";
  const queryValues = [];

  if (sort_by){
    query += `ORDER by ${sort_by} DESC`;
  }

  return db
    .query(query, queryValues)
    .then(({rows})=>{
        return rows;
    });
}
exports.selectArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({rows})=>{
      if(rows.length === 0){
        return Promise.reject({status: 404, msg: "Not found"});
      } else return rows[0];
    })
}
exports.selectAllArticleCommentsById = (article_id) => {
  return db
    .query("SELECT * FROM comments WHERE article_id = $1 ORDER by created_at DESC", [article_id])
      .then(({rows})=>{
        if(rows.length === 0){
          return Promise.reject({status: 404, msg: "Not found"});
        } else return rows;
    })
}
exports.insertArticleIdComment = (article_id, username, body) => {
  return db
    .query("INSERT into comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;", [article_id, username, body])
    .then(({ rows })=>{

      if(rows.length === 0){
        return Promise.reject({status: 404, msg: "Not found"});
      } else return rows[0];
    })
}
exports.updateArticleId = (article_id, inc_votes) => {
  return db
    .query("UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *", [article_id, inc_votes])
    .then(({ rows })=>{
      if(rows.length === 0){
        return Promise.reject({status: 404, msg: "Not found"});
      } else return rows[0];
    })
}
exports.removeCommentByCommentID = (comment_id) => {
  return db
  .query("DELETE FROM comments WHERE comment_id = $1", [comment_id])
  .then(({ rows })=>{
    if(rows.length > 0){
      return Promise.reject({status: 404, msg: "Not found"});
    } else return rows[0];
  })
}
exports.selectAllUsers = () => {
  let query = "SELECT * FROM users";

  return db
    .query(query)
    .then(({rows})=>{
        return rows;
    });
}