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
  createAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("stores", StoreSchema);
