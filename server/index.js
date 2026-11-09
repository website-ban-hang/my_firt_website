
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

// Kiểm tra Server
app.get("/", (req, res) => {
    res.send("Server đang hoạt động!");
});

// Kết nối MongoDB và khởi chạy Server
const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("Chưa cấu hình MONGODB_URI trong file .env");
        }

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB kết nối thành công!");

        app.listen(PORT, () => {
            console.log(`Server đang chạy tại http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Lỗi khởi chạy Server:", error.message);
    }
}

startServer();
