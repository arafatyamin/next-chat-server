const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const PORT = 5000 || process.env.PORT;
const { MongoClient, ServerApiVersion } = require('mongodb');


app.use(cors());



const httpServer = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        method: ["GET", "POST"],
    },
});


// Connect to MongoDB

const uri = `mongodb+srv://dentalCare:LQ8WJAYSKIuFrNkb@cluster0.o0lhbrs.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const messagesCollection = client.db("chatApplication").collection("messages");


io.on("connection", (socket) => {
    console.log("new user connected to our app");

// send message from the mongodb collection
  socket.on("newMessage", function(msg){
    messagesCollection.insertOne({msg}, (err) => {
          if (err) return console.error(err);
          console.log("Message saved to MongoDB", msg);
        })
        io.emit("sendMessage", msg)
  })

  // // get chat from the mongodb collection
  // messagesCollection.find().toArray(function(err, {res}) {
  //   if (err){ throw err;}
  //   console.log('Messages fetched from database:', res);
  //   // emit the messages
  //   socket.emit('recivedMessage', res);
  // })

  // send all messages to the new client
  // messagesCollection.find((err, messages) => {
  //   if (err) return console.error(err);
  //   socket.emit('messages', messages);
  // });

  messagesCollection.find().toArray((err, results) => {
    if (err) {
      console.log(err);
    } else {
      // Send the data to the client(s)
      socket.emit('myData', results);
    }
  });












    // // Emit all messages to client on connection
    //     messagesCollection.find({}).toArray((err, msg) => {
    //         if (err) return console.error(err);
    //         console.log(msg)
    //         socket.emit("allMessages", 'my name is yamin');
    //         socket.emit('mymessage', )
            
    //     })

        
    // // Receive new message from client
    // socket.on("newMessage", (message) => {
    //     messagesCollection.insertOne(message, (err) => {
    //     if (err) return console.error(err);

    //     console.log("Message saved to MongoDB", message);
    //     });


    

    

    // Disconnect listener
  socket.on("disconnect", () => {
    console.log("A user has disconnected");
  });

});


app.get('/', (req, res) => {
    res.send('sockt server running');
  })

httpServer.listen(PORT, function () {
    console.log(`socket server is running at ${PORT}`)
})