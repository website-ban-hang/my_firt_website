const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
    label: { type: String, trim: true, default: "Nhà riêng" },
    recipient: { type: String, trim: true, required: true },
    phone: { type: String, trim: true, required: true },
    address: { type: String, trim: true, required: true },
    isDefault: { type: Boolean, default: false }
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false },
    addresses: { type: [AddressSchema], default: [] },
    createAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("users", UserSchema);
