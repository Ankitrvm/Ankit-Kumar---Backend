const mongoose = require("mongoose");

const CompaniesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const Companies = mongoose.model("companies", CompaniesSchema);

module.exports = { Companies };
