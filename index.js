const express = require('express');
const http = require('http');
const cors = require('cors');
const PORT = 5000 || process.env.PORT;
const app = express();
app.use(cors());


const httpServer = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        method: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("new user connected to our app");

    socket.on("disconnect", (socket) => {
        console.log("user disconnected");
    })

    socket.on("joinRoom", (data)=>{
        socket.join(data)
    })


    // socket.on("roomEvent", (data) => {
    //     console.log(data);
    //     socket.to(data.room).emit("showMessage", data);
    // })
    socket.on("chatEvent", (data) => {
        console.log(data);
        // socket.broadcast.emit("showChat", data);
        socket.to(data.room).emit("showChat", data);
    })

});


app.get('/', (req, res) => {
    res.send('let start socket io')
})



httpServer.listen(PORT, function () {
    console.log(`socket server is running at ${PORT}`)
})