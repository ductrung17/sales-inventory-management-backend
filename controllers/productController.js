const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");
// Create
// const createProduct = async (req, res) => {
//   try {
//     const product = await Product.create(req.body);
//     res.json(product);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };
// Update
// const updateProduct = async (req, res) => {
//   try {
//     const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     if (!updated) return res.status(404).json({ error: "Not found" });
//     res.json(updated);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

const createProduct = async (req, res) => {
  try {
    const { name, importPrice, sellPrice, stock, description } = req.body;

    let image = "";
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const product = await Product.create({
      name,
      importPrice,
      sellPrice,
      stock,
      description,
      image,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, importPrice, sellPrice, stock, description } = req.body;

    const updatedData = {
      name,
      importPrice,
      sellPrice,
      stock,
      description,
    };

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }

    // Nếu có ảnh mới, xóa ảnh cũ và cập nhật ảnh mới
    if (req.file) {
      // Xóa ảnh cũ khỏi hệ thống tệp nếu tồn tại
      if (product.image) {
        const oldImagePath = path.join(__dirname, "..", product.image);
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error("Không thể xóa ảnh cũ:", err.message);
          }
        });
      }

      updatedData.image = `/uploads/${req.file.filename}`;
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
      }
    );

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Read all
const getAllProducts = async (req, res) => {
  try {
    const search = req.query.search || "";
    const regex = new RegExp(search, "i"); // không phân biệt hoa thường

    const products = await Product.find({
      $or: [{ name: { $regex: regex } }, { description: { $regex: regex } }],
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read one
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });

    // Nếu sản phẩm có ảnh thì xóa ảnh khỏi thư mục uploads
    if (product.image) {
      const imagePath = path.join(__dirname, "..", product.image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Không thể xóa ảnh sản phẩm:", err.message);
        }
      });
    }

    // Xóa sản phẩm khỏi cơ sở dữ liệu
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa sản phẩm thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
