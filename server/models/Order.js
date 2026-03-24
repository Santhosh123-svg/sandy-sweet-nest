import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    productName: String,
    category: String,
    quantity: Number,
    totalAmount: Number,

    deliveryDate: String,
    deliveryTime: String,

    // Cake Specific Info
    cakeInfo: {
      deliveryDate: String,
      preferredTime: String,
      purpose: String,
      cakeText: String,
      flavor: String,
      size: String,
      shape: String,
      toppings: [String],
    },

    // Customer Info
    customer: {
      name: String,
      email: String,
      phone: String,
      address: String,
    },
    
    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
