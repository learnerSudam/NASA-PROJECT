const express = require('express');


//adding an end point get all planets
//while importing the controllers we can destructure it, so that we have better visiblity on the imported functions
//We have kept the controller and routs for plantes under planet folder
const {
    httpGetAllPlanets,
} =  require('./planets.controller');

const planetsRouter = express.Router();

planetsRouter.get('/', httpGetAllPlanets);

module.exports= planetsRouter;