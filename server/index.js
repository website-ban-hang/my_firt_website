const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();

// Always keep the production frontend and local development origins allowed.
// CLIENT_URL may contain one or more additional comma-separated origins.
const defaultOrigins = [
  "https://my-firt-website-client.vercel.app",
  "http://localhost:3000"
];
const configuredOrigins = (process.env.CLIENT_URL || "").split(",");
const allowedOrigins = [...new Set([...defaultOrigins, ...configuredOrigins]
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean))];

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

// These endpoints must remain reachable even when MongoDB is unavailable.
app.get("/", (req, res) => res.status(200).send("Server đang hoạt động!"));
app.get("/favicon.ico", (req, res) => res.status(204).end());

// Log only safe MongoDB error metadata. Driver messages/stacks can contain the URI.
function logDatabaseError(context, error) {
  console.error(context, {
    name: error && error.name ? error.name : "DatabaseError",
    code: error && (error.code || error.codeName) ? (error.code || error.codeName) : undefined
  });
}

// Keep one MongoDB connection across Vercel function invocations when possible.
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn && mongoose.connection.readyState === 1) return cached.conn;

  if (!process.env.MONGODB_URI) {
    throw new Error("Thiếu biến môi trường MONGODB_URI trên Vercel");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    })
      .then((mongooseInstance) => mongooseInstance)
      .catch((error) => {
        cached.promise = null;
        cached.conn = null;
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Health check explicitly tests MongoDB and returns a useful, non-secret error code.
app.get("/health", async (req, res) => {
  try {
    await connectDB();
    return res.status(200).json({
      success: true,
      status: "ok",
      database: "connected"
    });
  } catch (error) {
    logDatabaseError("Health check - MongoDB connection failed:", error);
    return res.status(503).json({
      success: false,
      status: "error",
      database: "disconnected",
      error: error.name || "DatabaseConnectionError",
      code: error.code || error.codeName || null,
      message: "Không thể kết nối cơ sở dữ liệu; xem Function Logs để biết chi tiết"
    });
  }
});

app.use(express.static(path.join(__dirname, "public")));

// All API routes below this middleware require a working database.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    logDatabaseError("Lỗi kết nối MongoDB:", error);
    res.status(503).json({
      success: false,
      message: "Không thể kết nối cơ sở dữ liệu"
    });
  }
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
