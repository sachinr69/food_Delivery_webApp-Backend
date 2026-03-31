const express = require('express');
const router = express.Router();
const User = require("../models/USER");
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwt_Secret = "beautiful"

router.post('/createuser', [
    body('email', 'Invalid email').isEmail(),
    body('name', 'Name must be at least 3 characters').isLength({ min: 3 }),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
    body('location', 'Location is required').notEmpty()
],
async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(req.body.password, salt);

        await User.create({
            name: req.body.name,
            location: req.body.location,
            email: req.body.email,
            password: securePassword
        });

        res.json({ success: true });

    } catch (error) {
        console.error("ERROR:", error.message);

        if (error.code === 11000) {
            return res.json({ success: false, error: "Email already exists" });
        }

        res.json({ success: false, error: "Server error" });
    }
});


router.post('/loginuser', [
    body('email').isEmail(),
    body('password', 'Incorrect Password').isLength({min:5})
],
async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    let email = req.body.email;
    try {
        let userData = await User.findOne({ email });
        if (!userData) {
            return res.json({ success: false, error: "User not found" });
        }
        const pwd_compare = await bcrypt.compare(req.body.password,userData.password);

        if(!pwd_compare){
            return res.status(400).json({error:"try logging with correct credentials"})
        }
        const data = {
            user:{
                id:userData.id
            }
        }
        const authtoken = jwt.sign(data,jwt_Secret)
        res.json({ success: true,authtoken:authtoken });

    } catch (error) {
        console.error(error);
        res.json({ success: false, error: "Server error" });
    }
});


router.put("/updateUser", [
    body('email', 'Invalid email').isEmail(),
    body('name', 'Name must be at least 3 characters').isLength({ min: 3 }),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
],
async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, name, password } = req.body;

    try {
        const userData = await User.findOne({ email });

        if (!userData) {
            return res.json({ success: false, error: "User not found" });
        }

        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(password, salt);

        userData.name = name;
        userData.password = securePassword;

        await userData.save();

        res.json({ success: true });

    } catch (error) {
        console.error(error);
        res.json({ success: false, error: "Server error" });
    }
});

module.exports = router;