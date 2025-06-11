const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    importPrice: { type: Number, required: true },
    sellPrice: { type: Number, required: true },
    stock: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
