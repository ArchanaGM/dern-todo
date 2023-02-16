const express = require('express')
const app = express()
const dynamoose = require("dynamoose");

app.use(express.json())
// Dynamoose configuration
const dotenv = require('dotenv');
dotenv.config();

dynamoose.aws.sdk.config.update({
    "accessKeyId": process.env.AWS_ACCESS_KEY_ID,
    "secretAccessKey": process.env.AWS_SECRET_ACCESS_KEY,
    "region": "us-east-1",
});
// app.get('/', (req, res) => res.send('Hello world!'))

// morgan for logging
const morgan = require("morgan")
app.use(morgan('dev'))


// Import Routes
app.use(require("./routes"))

module.exports = app;