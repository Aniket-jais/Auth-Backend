let routerCrudeOperation = require("../../router/heroCrudeRouter");
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 3000;
const mongoose = require('mongoose');
//const joi = require('joi');
mongoose.connect('mongodb://localhost/SuperHeroes');
app.use(bodyParser.json());
app.use(routerCrudeOperation);
app.listen(PORT,(req,res)=>{
    console.log(`server running on ${PORT}`);
});



