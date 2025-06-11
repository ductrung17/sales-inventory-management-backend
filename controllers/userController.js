const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const handleRegister = async (req, res) => {
  const { name, phone, email, password, confirmedPassword } = req.body;

  // Kiểm tra các trường bắt buộc
  if (!name || !phone || !email || !password || !confirmedPassword) {
    return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
  }

  // Kiểm tra mật khẩu xác nhận
  if (password !== confirmedPassword) {
    return res.status(400).json({ message: "Mật khẩu xác nhận không khớp" });
  }

  try {
    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được đăng ký" });
    }

    // Mã hóa mật khẩu
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Tạo người dùng mới
    const newUser = new User({
      name,
      phone,
      email,
      password: hashedPassword,
    });

    // Lưu vào database
    await newUser.save();

    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    res.status(500).json({ message: "Lỗi server, vui lòng thử lại" });
  }
};

module.exports = handleRegister;

const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không đúng" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không đúng" });
    }

    // Tạo payload cho token, thường chứa ít thông tin để không quá lớn
    const payload = {
      userId: user._id,
      email: user.email,
    };

    // Tạo token với secret và thời hạn
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "30m",
    });

    res.status(200).json({
      message: "Đăng nhập thành công!",
      token, // trả luôn token cho client
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server, vui lòng thử lại" });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = {
  handleRegister,
  handleLogin,
  getProfile,
};
