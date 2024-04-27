const {getAllPlanets} = require('../../models/planets.model');


//creating the function for getAllPlanets and exporting it
function httpGetAllPlanets(req, res){
    return res.status(200).json(getAllPlanets());
}

module.exports = {
    httpGetAllPlanets,
};