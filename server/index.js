const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();

// Set CLIENT_URL to the deployed frontend origin. Multiple origins may be comma-separated.
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:3000")
  .split(",").map((origin) => origin.trim().replace(/\/+$/, "")).filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin.replace(/\/+$/, ""))) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => res.status(200).send("Server đang hoạt động!"));

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!process.env.MONGODB_URI) throw new Error("Chưa cấu hình MONGODB_URI");
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI)
      .then((mongooseInstance) => mongooseInstance)
      .catch((error) => { cached.promise = null; throw error; });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

app.use(async (req, res, next) => {
  try { await connectDB(); next(); }
  catch (error) {
    console.error("Lỗi kết nối MongoDB:", error);
    res.status(500).json({
      success: false, message: "Không thể kết nối cơ sở dữ liệu",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});

// Deployment health check: confirms MongoDB is reachable as well as the API process.
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});


const authRouter = require("./routers/auth");
const postRouter = require("./routers/Post");
const storeRouter = require("./routers/Store");
const storageCartRouter = require("./routers/StorageCart");
const theOderRouter = require("./routers/TheOderRouter");
app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/store", storeRouter);
app.use("/storagecart", storageCartRouter);
app.use("/theoder", theOderRouter);

module.exports = app;

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log("Server listening on port " + port));
}