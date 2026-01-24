import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // 🔐 NEW (duplicate prevent)
    clientOrderId: {
      type: String,
      unique: true,
      sparse: true, // old orders-ku problem varama iruka
    },

    orderId: {
      type: String,
      default: () => "ORD-" + Date.now(),
    },

    userName: {
      type: String,
      default: "Unknown User",
    },

    userEmail: {
      type: String,
      default: "No email",
    },

    items: [
      {
        name: String,
        quantity: Number,
        price: Number,
      },
    ],

    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
