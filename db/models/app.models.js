// Setup:
const db = require("../connection");

exports.selectAllTopics = () => {
  let query = "SELECT * FROM topics";

  // Returning:
  return db
    .query(query)
    .then(({rows})=>{
        return rows;
    });
}

