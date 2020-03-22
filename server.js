const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose')
//const router = express.Router();


const port = 3000;
const app = new express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const authRoute = require('./api/routes/auth');

app.use('/auth',authRoute);


app.listen(port,()=>
{
    console.log("listening on port",port);
})



module.exports= app;