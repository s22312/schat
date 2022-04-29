const express = require("express");
const router = new express.Router();

router.get("/profile", (req, res) => {
    res.json(req.session.profile)
});

module.exports = router;