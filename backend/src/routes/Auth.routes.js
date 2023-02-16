const router = require("express").Router()
const authController = require("../controllers/Auth.controller")
const jwtAuth = require('../utils/JWTauth')
// POST - /api/auth/register
router.post('/register', authController.register)
// POST - /api/auth/login
router.post('/login', authController.login)
// PROTECTED ROUTE - ALL /api/auth/protected
router.all('/protected', jwtAuth.authenticateToken, authController.protected)

module.exports = router;