const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentId: {
      type: String,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    receipt: {
      type: String,
      required: true,
    },
    notes: {
      userId: {
        type: String,
        required: true,
      },
      membershipType: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Payment", paymentSchema);
