require("dotenv").config();
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = new (require("socket.io").Server)(server);
app.use("/static", express.static(__dirname + "/static/"));

const _hd = __dirname + "/html";
const google = require("./google");
google.init(app);

app.get("/", (req, res) => {
    res.sendFile(_hd + "/index.html");
});

app.get("/home", google.isAuthenticated, (req, res) => {
    res.sendFile(_hd + "/home.html");
});

app.listen(8811, "0.0.0.0", () => {
    console.log("Listening on 0.0.0.0");
});