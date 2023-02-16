const router = require('express').Router();
const authRoutes = require('./Auth.routes')

// Moved our API Root GET "Hello world!" here
router.get('/', (req, res) => res.send('Hello world!'))

// Import Auth routes
router.use('/api/auth', authRoutes)

module.exports = router;