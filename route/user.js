const express = require('express');
const auth = require('./../controller/auth');
const { getAllUser } = require('../controller/user');
const router = express.Router();

router.post('/signUp', auth.signUp);
router.post('/login', auth.login);
router.get('/', auth.protect, getAllUser);

module.exports = router;
