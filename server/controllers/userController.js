const User = require("../models/User");

exports.completeProfile = async (req, res) => {
  try {
    const { fullName, phone, address } = req.body;

    await User.findByIdAndUpdate(req.user.id, {
      fullName,
      phone,
      address,
      profileCompleted: true,
    });

    res.status(200).json({ message: "Profile completed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
