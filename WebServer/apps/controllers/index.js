const express = require("express");
const userModel = require("../models/user");
const pwdHash = require("../common/data_encrypt");

var router = express.Router();

router.use("/admin", require("./admin"));

router.get("/", (req, res) => {
    let localData = { pageTitle: "Đăng nhập" };
    res.render("login", { localData });
});

// Function login
router.get("/login", (req, res) => {
    let localData = { pageTitle: "Đăng nhập" };
    res.render("login", { localData });
});
router.post("/login", (req, res) => {
    let localData = {
        pageTitle: "Đăng nhập",
        error: ""
    };
    let params = req.body;
    if (params.usr.trim().length == 0 || params.pwd.trim().length == 0) {
        localData.error = "Vui lòng điền đầy đủ thông tin";
        res.render("login", { localData });
    }

    // Login and redirect
    let userData = userModel.getUser(params.usr);
    if (userData) {
        userData.then((dataRows) => {
            let user = dataRows[0];
            if (pwdHash.comparePassword(params.pwd, user.password)) {
                req.session.user = {
                    username: user.username,
                    fullname: user.fullname
                };
                console.log(req.session.user);
                res.redirect("/admin/");
            }
            else {
                localData.error = "Tài khoản hoặc mật khẩu không chính xác";
                res.render("login", {localData});
            }
        }).catch((err) => {
            localData.error = "Tài khoản không tồn tại";
            res.render("login", { localData });
        })
    }
    else {
        localData.error = "Tài khoản không tồn tại";
        res.render("login", { localData });
    }
});

// Function register
router.get("/register", (req, res) => {
    let localData = { pageTitle: "Đăng ký" };
    res.render("register", { localData });
});
router.post("/register", (req, res) => {
    let localData = {
        pageTitle: "Đăng ký",
        error: "",
        success: ""
    }
    let user = req.body;
    if (user.fullname.trim().length == 0 ||
        user.usr.trim().length == 0 ||
        user.pwd.trim().length == 0 ||
        user.retype.trim().length == 0) {
        localData.error = "Vui lòng điền đầy đủ thông tin";
        res.render("register", { localData });
    }
    if (user.fullname.trim().length != 0 &&
        user.usr.trim().length != 0 &&
        user.pwd.trim().length != 0 &&
        user.pwd.trim().length != user.retype.trim().length) {
        localData.error = "Mật khẩu không khớp";
        res.render("register", { localData });
    }

    // Insert user into database
    let password = pwdHash.hashPassword(user.pwd);
    let newUser = {
        username: user.usr,
        password: password,
        fullname: user.fullname
    }
    let result = userModel.addUser(newUser);
    result.then((data) => {
        localData.success = "Đăng ký thành công!";
        localData.pageTitle = "Đăng nhập";
        res.redirect("login");
    }).catch((err) => {
        localData.error = "Có lỗi gì gì đó";
        res.render("register", { localData });
    })

});

router.get("/admin", (req, res) => {
    res.render("admin");
});

router.get("/test", (req, res) => {
    let localData = { pageTitle: "test" };
    res.render("socket", {layout: 'admin',localData});
})


module.exports = router;