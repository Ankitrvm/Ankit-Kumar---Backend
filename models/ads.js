const mongoose = require("mongoose");

const AdsSchema = new mongoose.Schema({
  primaryText: {
    type: String,
    required: true,
  },
  headline: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  cta: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "companies",
  },
});

const Ads = mongoose.model("ads", AdsSchema);

module.exports = { Ads };
