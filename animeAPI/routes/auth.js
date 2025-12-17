const express = require("express");
const router = express.Router();

const AuthenticationController = require("../controllers/authentication_controller");

router.post("/", AuthenticationController.signup);

module.exports = router;
