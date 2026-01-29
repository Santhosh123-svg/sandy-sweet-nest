import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String
  },

  role: {
    type: String,
    default: "user"   // 👈 user / admin
  },

  profileCompleted: {
    type: Boolean,
    default: false
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  phone: {
    type: Number  },

  address: {
    type: String
  }
});

export default mongoose.model("User", userSchema);
