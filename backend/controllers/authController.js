const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("express-async-handler")
exports.registerUser = asyncHandler(async (req, res) => {
 
  const { name, email, password } = req.body;

 
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }


  const userExist = await User.findOne({ email: email.toLowerCase().trim() });
  if (userExist) {
    res.status(400);
    throw new Error("User already exists");
  }

 
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);


  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(), 
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// LOGIN
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

 
  const user = await User.findOne({ email: email.toLowerCase().trim() });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    
    res.status(401);
    throw new Error("Invalid credentials");
  }
});
