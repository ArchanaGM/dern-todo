const dynamoose = require("dynamoose");

const todoSchema = new dynamoose.Schema({
    "id": String, //UUIDv4
    "user": Object,
    "title": String,
    "notes": String,
    "dueDate": String,
    "status": String,
}, {
    "timestamps": true
})

const Todo = dynamoose.model("Todo", todoSchema)

module.exports = Todo