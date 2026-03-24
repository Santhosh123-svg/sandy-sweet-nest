import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    // 🔐 PASSWORD (optional for magic link users)
    password: {
      type: String,
      required: false
    },

    role: {
      type: String,
      default: "user"
    },

    profileCompleted: {
      type: Boolean,
      default: false
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    // 📱 PHONE (old system - keep safe)
    phone: {
      type: String,
      unique: true,
      sparse: true
    },

    address: {
      type: String,
      trim: true
    },

    // 🔥 OPTIONAL (future use - safe add)
    authProvider: {
      type: String,
      enum: ["local", "magic", "otp"],
      default: "otp"
    }

  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);