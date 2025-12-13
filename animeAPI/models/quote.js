const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema({
  character: {
    type: String,
    required: true,
  },
  anime: {
    type: String,
    required: true,
  },
  quote: {
    type: String,
    required: true,
  },
});

const Quote = mongoose.model("Quote", quoteSchema);

module.exports = Quote;
