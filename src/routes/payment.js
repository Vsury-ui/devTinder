const express = require("express");
const authRouter = require("./auth");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const payment = require("../models/payments");
const User = require("../models/user");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const { membershipAmount } = require("./constants");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, email } = req.user;
    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType] * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        membershipType: membershipType,
        firstName: firstName,
        lastName: lastName,
        email: email,
      },
    });

    const payment = new payment({
      userId: req.user._id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });
    const savedPayment = await payment.save();

    res.json({ ...savedPayment.toJson(), key: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).send("Error creating payment");
  }
});

paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const isValid = await validateWebhookSignature(
      JSON.stringify(req.body),
      req.headers["x-razorpay-signature"],
      process.env.RAZORPAY_WEBHOOK_SECRET,
    );
    if (!isValid) {
      return res.status(400).send("Invalid webhook signature");
    }

    const paymentDetails = req.body.payload.payment.entity;

    if (req.body.event === "payment.captured") {
      const payment = await payment.findOne({
        orderId: paymentDetails.orderId,
      });
      payment.status = "captured";
      payment.paymentId = paymentDetails.id;
      await payment.save();

      const user = await User.findOne({ _id: payment.userId });
      user.membershipType = payment.notes.membershipType;
      user.isPremium = true;
      await user.save();
    }
    // if (req.body.event === "payment.failed") {
    //   // Handle failed payment
    // }

    res.status(200).send({ msg: "Webhook received" });
  } catch (error) {
    console.error("Error validating webhook signature:", error);
    res.status(500).send("Error validating webhook signature");
  }
});

paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (user.isPremium) {
      return res.json({ isPremium: true, membershipType: user.membershipType });
    } else {
      return res.json({ isPremium: false });
    }
  } catch (error) {
    console.error("Error verifying premium status:", error);
    res.status(500).send("Error verifying premium status");
  }
});
module.exports = paymentRouter;
