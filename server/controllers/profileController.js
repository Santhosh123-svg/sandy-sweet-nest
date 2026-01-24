import User from "../models/User.js";

export const completeProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const userId = req.user.id; // token decoded user id

    await User.findByIdAndUpdate(userId, {
      name,
      phone,
      address,
      profileCompleted: true,
    });

    res.json({ message: "Profile updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
