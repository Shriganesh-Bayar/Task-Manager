const User = require("../models/User");
const router = require('express').Router();
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res, next) => {
    try {
        const result = await User.createUser(req.body.data);
        if (result.error)
            return res.json({ error: result.error });
        res.json({ result });
    } catch (error) {
        next(error);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const result = await User.login(req.body.data);
        if (result.error)
            return res.json({ error: result.error });

        const token = jwt.sign({
            user_id: result.user_id,
            user_name: result.user_name,
        }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        });
        res.json({ token, user: result });
    } catch (error) {
        next(error);
    }
});

module.exports = router;