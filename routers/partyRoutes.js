const express = require("express");
const router = express.Router();
const authJwt = require("../Authentication/auth");
const { validateRole } = require("../Authentication/accessController");
const { createParty } = require("../controllers/Admin/partyControllerAdmin");

router.get("/createparty", authJwt(), validateRole(["Admin"]), createParty);

module.exports = router;
