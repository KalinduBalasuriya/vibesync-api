const { token } = require("morgan");
const { User } = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Guest User SignUp (without role property)
const signUp = async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
  });

  user = await user.save();
  if (!user)
    return res.status(400).json({
      success: false,
      message: null,
      data: null,
      errorMessage: "User cannot be created!",
    });
  res.send(user);
};

//User Login
const login = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.secret;

  if (!user) {
    return res.status(200).json({
      success: false,
      message: null,
      data: null,
      errorMessage: "Invalid e-mail/Username",
    });
  }

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      secret,
      { expiresIn: "1d" }
    );
    res.status(200).send({
      user: user.email,
      name: user.name,
      userRole: user.role,
      token: token,
      errorMessage: null,
    });
  } else {
    res.status(200).json({
      success: false,
      message: null,
      data: null,
      errorMessage: "Invalid Password",
    });
  }
  next();
};

const getUsers = async (req, res) => {
  const userList = await User.find();
  res.json({ users: userList });
  if (!userList) {
    return res.status(500).json({
      success: false,
    });
  }
};

const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user.userId).select("-passwordHash");

  if (!user) {
    return res.status(500).json({
      success: false,
      message: "User not found",
      data: {
        user: user,

        token: req.headers["authorization"],
      },
      errorMessage: "User not found",
    });
  }
  res.status(200).json({
    success: true,
    message: "User logged in success",
    data: {
      user: user,

      token: req.headers["authorization"],
    },
    errorMessage: "User logged in success",
  });
};

exports.login = login;
exports.signUp = signUp;
exports.getUsers = getUsers;
exports.getCurrentUser = getCurrentUser;
