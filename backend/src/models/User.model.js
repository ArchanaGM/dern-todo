const dynamoose = require("dynamoose");

const userSchema = new dynamoose.Schema({
    "id": String, // UUIDv4 ID
    "username": String,
    "password": String,
}, {
    "timestamps": true
})

const User = dynamoose.model("User", userSchema)

module.exports = User