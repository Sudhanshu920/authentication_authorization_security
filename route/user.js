const express = require('express');
const auth = require('./../controller/auth');
const router = express.Router();

router.post('/signUp', auth.signUp);

module.exports = router;
