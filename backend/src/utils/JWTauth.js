const jwt = require('jsonwebtoken')

exports.generateAccessToken = function (username) {
    return jwt.sign({uid: username}, process.env.JWT_SECRET, {expiresIn: "2h"})
}

exports.authenticateToken = function (req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(token == null) {
        return res.sendStatus(401)
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) {
            console.log(err)
            return res.status(403)
        }

        req.user = user
        next()
    })
}