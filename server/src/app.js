const path = require('path');
const morgan = require('morgan');
const express = require ('express');
const cors = require('cors');

const api = require('./routes/api')

const app = express();

//browser 
app.use(cors({
    //here we are white listing the port which client is using
    origin: 'http://localhost:3000'
}));
app.use(morgan('combined'));
app.use(express.json());
//
app.use(express.static(path.join(__dirname,'..','public')));
app.use('/v1',api);

//whenever we make an request , express will look for the respective file
//if it no match it will look inside the apis, so here be is managing the route
//it needs to be our fe (react) which should manage it
app.get('/*', (req, res) =>{
    //here if express didn't find anything in the apis or files it will pass it
    //onto the FE app(react) index.html file
    res.sendFile(path.join(__dirname,'..', 'public', 'index.html'));
});

module.exports = app;