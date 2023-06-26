const db = require("../connection");

exports.selectAllTopics = () => {
  let query = "SELECT * FROM topics";

  return db
    .query(query)
    .then(({rows})=>{
        return rows;
    });
}