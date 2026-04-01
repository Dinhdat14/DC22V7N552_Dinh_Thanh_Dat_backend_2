const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const userExists = await User.findOne({ username: req.body.username });
        if (userExists) return res.status(400).send({ message: "Tên người dùng đã tồn tại." });

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });
        await user.save();
        res.send({ message: "Đăng ký thành công!" });
    } catch (error) {
        res.status(500).send({ message: "Lỗi khi đăng ký: " + error.message });
    }
};

exports.login = async (req, res) => {
    try {
        console.log("BODY:", req.body);
        const user = await User.findOne({ username: req.body.username });
        if (!user) return res.status(404).send({ message: "Người dùng không tồn tại." });

        const passwordIsValid = await bcrypt.compare(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({ message: "Mật khẩu không chính xác!" });

        // Sửa lại dòng này: Đảm bảo Secret Key đầy đủ
        const token = jwt.sign({ id: user._id }, "bi-mat-cua-dat", { expiresIn: 86400 });

        res.status(200).send({
            message: "Đăng nhập thành công!",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
            accessToken: token
        });
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        res.status(500).send({ message: error.message });
    }
};