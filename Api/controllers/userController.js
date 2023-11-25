const factory = require("./factory");
const multer = require("multer");
const db = require("../models");
const sharp = require("sharp");
const User = db.models.USER;
const { Sequelize, literal, fn, col } = require("sequelize");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("please upload a photo", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("avatar");

exports.resizeUserPhoto = async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`photos/avatars/${req.file.filename}`);

  next();
};

/////////////// calculate average rating
const calculateAverageRatingForUser = async (userId) => {
  try {
    const Ngom = db.models.NGOM;

    // Fetch all ratings for the user
    const ratings = await Ngom.findAll({
      attributes: ["rating"], // Assuming 'rating' is the name of the field in the NGOM model
      where: { receiverId: userId },
    });

    if (!ratings || ratings.length === 0) {
      return 0; // Return 0 if there are no ratings
    }
    const numberOfRatings = ratings.length;

    // Calculate the average rating
    const sumOfRatings = ratings.reduce(
      (sum, rating) => sum + rating.rating,
      0
    );
    const averageRating = sumOfRatings / numberOfRatings;
    return { averageRating, numberOfRatings };
  } catch (error) {
    console.error("Error calculating average rating for user:", error);
    throw error;
  }
};

exports.getAllUsers = factory.getAll(User);

exports.getUser = async (req, res) => {
  try {
    // Use await for asynchronous operations
    let user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { averageRating, numberOfRatings } =
      await calculateAverageRatingForUser(user.userId);

    // Log the calculated total rating

    res.status(200).json((data = { user, numberOfRatings, averageRating }));
  } catch (error) {
    // Handle errors properly
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = factory.deleteOne(User);

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = async (req, res, next) => {
  req.params.id = req.user.userId;
  next();
};

exports.updateMe = async (req, res, next) => {
  try {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return res.status(400).json({
        status: "fail",
        message:
          "This route is not for password updates. Please use /updateMyPassword.",
      });
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, "fullName", "email");
    if (req.file) filteredBody.avatar = req.file.filename;
    console.log(filteredBody);
    // 3) Update user document
    const updatedUser = await User.update(filteredBody, {
      where: {
        userId: req.user.userId, // Replace with the appropriate condition for your user
      },
      returning: true, // This option returns the updated user
    });
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
