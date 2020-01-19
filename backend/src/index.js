const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors')
const http = require('http')

const app = express();
const server = http.Server(app);


mongoose.connect('mongodb+srv://lucas:123lucas123@cluster0-eiigr.mongodb.net/week10?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(cors())
app.use(express.json());
app.use(routes);

app.listen(3333);
