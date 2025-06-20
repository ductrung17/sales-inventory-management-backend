const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["manager", "staff"],
      default: "staff",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
