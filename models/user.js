const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstname: { type: String, required:true },
    lastname: { type: String, required:true },
    email: { type: String, required:true},
    password: { type: String, required:true },
    city: { type: String, required:true},
    country: { type: String, required:true },
    phone: { type: Number, required:true},
    linkedin: { type: String, required:true },
    image: {
      type: String,
      default: "https://www.esandai.com/upload/users/user-avatar.png",
    },
    jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    portfolio: { type: mongoose.Schema.Types.ObjectId, ref: "Portfolio" },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
