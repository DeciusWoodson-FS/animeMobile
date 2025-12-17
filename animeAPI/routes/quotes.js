const express = require("express");
const passport = require("passport");

const passportService = require("../services/passport");
const protectedRoute = passport.authenticate("jwt", { session: false });
const router = express.Router();

const Quote = require("../models/quote");

// GET, POST, PUT, DELETE

const getQuote = async (req, res, next) => {
  let quote;
  try {
    quote = await Quote.findById(req.params.id);
    if (quote === null) {
      return res.status(404).json({ message: "Quote not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.quote = quote;
  next();
};

// GET all quotes
router.get("/", protectedRoute, async (req, res) => {
  try {
    const quotes = await Quote.find();
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get by id
router.get("/:id", getQuote, async (req, res) => {
  res.json(res.quote);
});

//create a quote
router.post("/", async (req, res) => {
  const quote = new Quote({
    character: req.body.character,
    anime: req.body.anime,
    quote: req.body.quote,
  });
  try {
    const newQuote = await quote.save();
    res.status(201).json(newQuote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//update a quote
router.patch("/:id", getQuote, async (req, res) => {
  if (req.body.quote != null) {
    res.quote.quote = req.body.quote;
  }
  if (req.body.anime != null) {
    res.quote.anime = req.body.anime;
  }
  if (req.body.character != null) {
    res.quote.character = req.body.character;
  }
  try {
    const updatedQuote = await res.quote.save();
    res.json(updatedQuote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//delete a quote
router.delete("/:id", getQuote, async (req, res) => {
  try {
    await res.quote.deleteOne();
    res.json({ message: "Quote deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
