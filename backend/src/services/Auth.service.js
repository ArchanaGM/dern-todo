// Import our Dynamoose User model, Bcrypt for password hashing and uuidv4
const User = require("../models/User.model")
const bcrypt = require("bcryptjs")
const {v4: uuidv4} = require("uuid")
const jwtAuth = require('../utils/JWTauth')

exports.registerUser = async function(newUserInfo) {
    // newUserInfo is req.body - so it should be a JSON object ie {"username":"adam","password":"adamPass"}

    // First, check is there's already a user registered with this username
    var existingUser
    try {
        // Runs a DynamoDB scan and returns the result
        existingUser = await User.scan({username: {eq: newUserInfo.username}}).exec()
    } catch (err) {
        console.log(err)
        throw new Error(err)
    }
    // If there already is a User, throw an Error
    if(existingUser.count > 0) {
        throw new Error("EXISTING_USER_ERROR")
    } 

    // User doesn't already exist, so let's register them
    var newUser 
    try {
        const uuid = uuidv4()
        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(newUserInfo.password, salt)
        newUser = await User.create({
            "id": uuid,
            "username": newUserInfo.username,
            "password": hashedPass
        })
    } catch (err) {
        console.log(err)
        throw new Error(err)
    }

    // TODO loginUser(newUser) -> return JWT w/ newUser
    var authToken = await exports.loginUser({"username": newUser.username, "password": newUserInfo.password})

    return authToken

   

    //return newUser
}

exports.loginUser = async function(userInfo) {
    // userInfo should be a JSON Object {"username":"adam","password":"adamPass"}
    // First, Check if the User even exists - In contrast to the above, in this case we do want there to be an existing User
    var existingUser
    try {
        existingUser = await User.scan({username: {eq: userInfo.username}}).exec()
    } catch (err) {
        console.log(err)
        throw new Error(err)
    }
    // If User doesn't exist, throw an error
    if(existingUser.count == 0) {
        throw new Error("INVALID_LOGIN_CREDENTIALS")
    }

    // Check if the supplied password matches the bcrypt hashed password saved in the User record
    var validPass
    try {
        // bcyrpt.compare will return true / false depending on if the passwords match
        // User.scan() always returns an array, hence why we specify existingUser[0].password below
        validPass = await bcrypt.compare(userInfo.password, existingUser[0].password)
    } catch (err) {
        console.log(err)
        throw new Error(err)
    }

    // If validPass is false, throw an error
    if(!validPass) {
        throw new Error("INVALID_LOGIN_CREDENTIALS")
    }

    // TODO - JWTs - We do need someway for our user to stay logged in after all
    var authToken = await jwtAuth.generateAccessToken(existingUser[0].username)

    return {token: authToken}

   // return {"message": "Login Successful"}
}