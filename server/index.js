
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, ".env")
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Hiển thị hình ảnh trong thư mục public
app.use(express.static(path.join(__dirname, "public")));

// Kiểm tra Server (không phụ thuộc MongoDB)
app.get("/", (req, res) => {
    res.status(200).send("Server đang hoạt động!");
});

// Quản lý kết nối MongoDB, tái sử dụng kết nối
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null
    };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!process.env.MONGODB_URI) {
        throw new Error("Chưa cấu hình MONGODB_URI");
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(process.env.MONGODB_URI)
            .then((mongooseInstance) => mongooseInstance)
            .catch((error) => {
                cached.promise = null;
                throw error;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

// Kết nối MongoDB trước khi xử lý API
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Lỗi kết nối MongoDB:", error);

        res.status(500).json({
            message: "Không thể kết nối cơ sở dữ liệu",
            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined
        });
    }
});

// Router
const authRouter = require("./routers/auth");
const postRouter = require("./routers/Post");
const storeRouter = require("./routers/Store");
const storageCartRouter = require("./routers/StorageCart");
const theOderRouter = require("./routers/TheOderRouter");

// Khai báo đường dẫn API
app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/store", storeRouter);
app.use("/storagecart", storageCartRouter);
app.use("/theoder", theOderRouter);

// Xuất ứng dụng cho Vercel
module.exports = app;
