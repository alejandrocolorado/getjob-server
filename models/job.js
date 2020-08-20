const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = new Schema({
  userId: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  title: { type: String },
  company_name: { type: String },
  publication_date: { type: Date },
  url: { type: String },
  tags: [{ type: String }],
  technologies: [
    {
      name: { type: String },
      url: { type: String },
    },
  ],
  candidate_required_location: { type: String },
  isApplication: { type: Boolean, default: false },
  jobType: { type: String, enum: ["remote", "project"] },
  category: { type: String },

  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
