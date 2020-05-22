var express = require("express");

var router = express.Router();


router.get("/", (req, res) => {
    console.log(req.session);
    let localData = {pageTitle: "Dashboard"}
    res.render("pages/index", {layout: 'admin', localData});
});
router.get("/devices", (req, res) => {
    let localData = {pageTitle: "Quản lý thiết bị"}
    res.render("pages/devices", {layout: 'admin', localData});
});
router.get("/control", (req, res) => {
    let localData = {pageTitle: "Điều khiển thiết bị"}
    res.render("pages/control", {layout: 'admin', localData});
});

module.exports = router;