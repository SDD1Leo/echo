const User = require("../models/authModel");

const search = async (req, res) => {
  try {
    const keyword = req.query.search;
    const loggedInUserId = req.user._id; // Assuming user ID is stored in req.user

    // Use regex for partial matching, case insensitive search, and exclude current user
    const data = await User.find({
      _id: { $ne: loggedInUserId }, // Exclude current user
      name: { $regex: keyword, $options: "i" }, // "i" for case insensitive
    });

    res.status(200).json(data); // Use 200 instead of 201 for GET requests
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { search };
