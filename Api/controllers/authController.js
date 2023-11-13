const db = require("../models");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = db.models.USER;
// Generate JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.Token_EXPIRES_IN,
  });
};

// send it in the response
const sendToken = (user, statusCode, res) => {
  const token = signToken(user.userId);

  const cookiesOptions = {
    expires: new Date(
      Date.now() + process.env.Token_COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookiesOptions.secure = true;

  user.password = undefined;
  res.cookie("jwt", token, cookiesOptions);
  res.status(statusCode).json({ message: "success", token, data: user });
};
/// signup
exports.signUp = async (req, res) => {
  try {
    const { userName, password, passwordConfirm, email, fullName } = req.body;

    // Save the new user to the database
    const newUser = await User.create({
      userName,
      password,
      passwordConfirm,
      email,
      fullName,
    });
    // Generate and send JWT token
    sendToken(newUser, 201, res);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
/// Login handler
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email && !password) {
      return next(new Error("Please provide email and password"));
    }

    let user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password, user.password))) {
      return next(new Error("Incorrect email or password"));
    }

    sendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new Error("You are not logged in! Please log in to get access.")
      );
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.TOKEN_SECRET
    );
    // 3) Check if user still exists
    const currentUser = await User.findByPk(decoded.id);
    if (!currentUser) {
      return next(
        new Error("The user belonging to this token does no longer exist.")
      );
    }
    console.log(currentUser.userId);

    // 4) Check if user changed password after the token was issued
    // if (currentUser.changedPasswordAfter(decoded.iat)) {
    //   return next(
    //     new Error("User recently changed password! Please log in again.")
    //   );
    // }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
