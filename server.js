const path = require("path");
const express = require("express");

const app = express();
const server = require("http").createServer(app);

app.use(express.static(path.join(__dirname, "public")));

const io = require("socket.io")(server);

io.on("connection", function (socket){
    socket.on("newuser", function (username){
        socket.broadcast.emit("update", username + " joined the conversation");
    });
    socket.on("exituser", function (username){
        socket.broadcast.emit("update", username + " left the conversation");
    });
    socket.on("chat", function (message){
        socket.broadcast.emit("chat", message);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});