const mongoose = require("mongoose");

const englishSchema = new mongoose.Schema({
  topic: String,
  explanation: String,
  examples: String
});

module.exports = mongoose.model("EnglishConcept", englishSchema);
