const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TheOderschema = new Schema({
    address: { type: String },
    tell: { type: String },
    recipient: { type: String },
    listOder: { type: Array },
    totalMoney: { type: Number },
    user: { type: Schema.Types.ObjectId, ref: "users" },
    // Legacy documents may still contain boolean status values.
    status: {
        type: Schema.Types.Mixed,
        default: "processing",
        validate: {
            validator: value => [false, true, "processing", "shipped", "delivered"].includes(value),
            message: "Trạng thái đơn hàng không hợp lệ"
        }
    },
    createAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("TheOders", TheOderschema);
