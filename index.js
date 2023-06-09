const express = require('express');
const mongoose = require('mongoose');
const app = express();
const http = require('http');
const cors = require('cors');
const PORT = 5000 || process.env.PORT;
const { MongoClient, ServerApiVersion } = require('mongodb');
const Msg = require('./models/message');

app.use(cors());

const httpServer = http.createServer(app);
const {Server} = require("socket.io");
// const io = new Server(httpServer, {
//     cors: {
//         origin: "https://next-chat-io.netlify.app/",
//     },
// });

const io = new Server(httpServer, {
  pingTimeout: 6000,
  cors: {
    "Access-Control-Allow-Origin": "*",
    origin: "https://next-chat-client-hwu2.vercel.app/",
    credentials: true,
  },
});


// Connect to MongoDB

const uri = `mongodb+srv://dentalCare:LQ8WJAYSKIuFrNkb@cluster0.o0lhbrs.mongodb.net/message-database?retryWrites=true&w=majority`;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log('connected')
}).catch(err => console.log(err))

// const messagesCollection = client.db("chatApplication").collection("messages");


io.on("connection", (socket) => {
    console.log("new user connected to our app");

    Msg.find().then(result => {
      socket.emit('output-messages', result)
  })

    // Disconnect listener
  socket.on("disconnect", () => {
    console.log("A user has disconnected");
  });

  socket.on('chatmessage', msg => {
    const message = new Msg({ msg });
    message.save().then((data) => {
      io.emit('message', data)
  })


})

});


app.get('/', (req, res) => {
    res.send('sockt server running');
  })

httpServer.listen(PORT, function () {
    console.log(`socket server is running at ${PORT}`)
})