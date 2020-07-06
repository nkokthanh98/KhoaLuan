const http = require("http");
const express = require("express");
const config = require("config");
const bodyParser = require("body-parser");
const expressLayouts = require('express-ejs-layouts');
const session = require("express-session");
const path = require("path");
const device = require("./apps/models/device");

var app = express();

//Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({encoded: true}));

//Temp variables
let t = 0, h = 0, sm = 0;
const st = 1, sh = 2, ssm = 3


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


    socket.on("data-from-device", (data) => {
        if(data.temperature != t && data.temperature){
            t = data.temperature
            let newData = {
                did: st,
                value: t
            }
            device.addData(newData)
            console.log(newData)
        }
        if(data.humidity != h && data.humidity){
            h = data.humidity
            let newData = {
                did: sh,
                value: h
            }
            device.addData(newData)
            console.log(newData)
        }
        if(data.soilmoisture != sm && data.soilmoisture){
            sm = data.soilmoisture
            let newData = {
                did: ssm,
                value: sm
            }
            device.addData(newData)
            
            console.log(newData)
        }
        socket.broadcast.emit("newData", data);
    });
    socket.on("pumper", (data) => {
        console.log(data.status)
        io.emit("newCommand", data);
    });
    socket.on("getavg", () => {
        let avg_t = device.getAvgByDID(1)
        let avg_h = device.getAvgByDID(2)
        let avg_sm = device.getAvgByDID(3)

        if(avg_sm){
            avg_sm.then((data) => {
                let result = {
                    id: 3,
                    value: data[0].result
                }
                io.emit("avgResult", result)
                console.log(result)
            }).catch((err) => {
            })
        }
        if(avg_t){
            avg_t.then((data) => {
                let result = {
                    id: 1,
                    value: data[0].result
                }
                io.emit("avgResult", result)
                console.log(result)
            }).catch((err) => {
            })
        }
        if(avg_h){
            avg_h.then((data) => {
                let result = {
                    id: 2,
                    value: data[0].result
                }
                io.emit("avgResult", result)
                console.log(result)
            }).catch((err) => {
            })
        }
    })
});


server.listen(port, host, () => {
    console.log(`Server is listening at ${host}:${port}`);
});
