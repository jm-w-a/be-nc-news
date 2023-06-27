const db = require("../connection");

exports.selectAllTopics = () => {
  let query = "SELECT * FROM topics";

  return db
    .query(query)
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