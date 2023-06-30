exports.handlePsqlErrors = (err, req, res, next) => {
    if (err.code === "22P02"){
        res.status(400).send({msg: "Bad request"});
    } if (err.code === "23503"){
        res.status(404).send({msg: "Not found"});
    } else next(err);
}
exports.handleCustomErrors = (err, req, res, next) => {
    if (err.msg){
        res.status(err.status).send({msg: err.msg});
    } else next(err);
}
exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send({msg: "I am broken..."});
}
