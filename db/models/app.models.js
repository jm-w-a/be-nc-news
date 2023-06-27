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

  let query = "SELECT article_id, author, title, topic, created_at, votes, article_img_url FROM articles ";
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
      }else return rows[0];
    })
}

