const db = require("../connection");

exports.selectAllTopics = () => {
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
exports.selectAllArticleCommentsById = (article_id) =>{
  return db
    .query("SELECT * FROM comments WHERE article_id = $1 ORDER by created_at DESC", [article_id])
      .then(({rows})=>{
        if(rows.length === 0){
          return Promise.reject({status: 404, msg: "Not found"});
        } else return rows;
    })
}