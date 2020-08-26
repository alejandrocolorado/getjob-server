const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String },
    apiId: {type: Number},
    company_name: { type: String },
    publication_date: { type: Date },
    url: { type: String },
    tags: [{ type: String }],
    tagsToShow:[{type: String}],
    technologies: {
      type: [
        {
          name: { type: String },
          url: { type: String },
        },
      ],
      validate: [arrayLimit, "{PATH} exceeds the limit of 3"],
    },
    candidate_required_location: { type: String },
    isApplication: { type: Boolean, default: false },
    category: { type: String },
    remotiveId: { type: Number },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);
function arrayLimit(val) {
  return val.length <= 3;
}
const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
