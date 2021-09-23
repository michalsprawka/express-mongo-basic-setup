require('dotenv').config();
const express = require('express');


const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const mongoose = require('mongoose');
const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rz656.mongodb.net/messages?retryWrites=true&w=majority`
//const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true});
const app = express();
//below are depracted see: https://medium.com/@mmajdanski/express-body-parser-and-why-may-not-need-it-335803cd048c
//app.use(bodyParser.urlencoded());
//app.use(bodyParser.json());

app.use(express.json());

app.use((req, res, next) => {
    
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();

})

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data: data});

} )
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true})
.then(result => {
    console.log("CONNECTED !")
    const server = app.listen(port=3003);
    const io = require('./socket').init(server);
    io.on('connection', socket =>{
       console.log("client connected"); 
       socket.on('message',(data)=>{
           print(data);
       })
    })
})
.catch(error => console.log(error));

