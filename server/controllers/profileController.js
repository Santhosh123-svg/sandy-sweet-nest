import User from "../models/User.js";

export const completeProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    if (!name || !phone || !address) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    user.phone = phone;
    user.address = address;
    user.profileCompleted = true;

    await user.save();

    res.status(200).json({
      success: true,
      profileCompleted: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
