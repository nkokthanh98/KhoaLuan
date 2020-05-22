const http = require("http");
const express = require("express");
const config = require("config");
const bodyParser = require("body-parser");
const expressLayouts = require('express-ejs-layouts');
const session = require("express-session");

var app = express();

//Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({encoded: true}));


// Configure trust proxy
app.set("trust proxy", 1);
app.use(session({
    secret: config.get("secret_key"),
    resave: false,
    saveUninitialized: true,
    cookie: {secure: true}
}));

app.set("views", __dirname + "/apps/views");
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set('layout', 'layout');

// Style and script
app.use("/static", express.static(__dirname + "/public"));

const controllers = require(__dirname + "/apps/controllers");

app.use(controllers);

var host = config.get("server.host");
var port = config.get("server.port");

let server = http.createServer(app);
let io = require("socket.io")(server);
/*
app.listen(port, host, () => {
    console.log(`Server is running on ${host}:${port}`);
});
*/

io.on("connection", (socket) => {
    console.log(`${socket.id} is connected`);

    socket.on("disconnect", () =>{
        console.log(`${socket.id} disconnected`);
    });

    socket.on("message", function(data) {
        console.log(data);
    });

    socket.on("data-from-device", (data) => {
        socket.broadcast.emit("newData", data);
    });
    socket.on("command-to-device", (data) => {
        socket.broadcast.emit("newData", data);
    });
});


server.listen(port, host, () => {
    console.log(`Server is listening at ${host}:${port}`);
});

