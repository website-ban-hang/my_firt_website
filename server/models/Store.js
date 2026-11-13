const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StoreSchema = new Schema({
  title: { type: String },
  img: { type: String },
  // Images uploaded on Vercel are stored durably in MongoDB, not in /tmp.
  imageData: { type: String },
  imageContentType: { type: String },
  status: { type: String },
  uer: { type: Schema.Types.ObjectId, ref: "users" },
  money: { type: Number },
  stock: { type: Number, min: 0, default: 0 },
  isHot: { type: Boolean, default: false },
  isBestSelling: { type: Boolean, default: false },
  createAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("stores", StoreSchema);
