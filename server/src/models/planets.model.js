
/*
We have kapt the plabets controller in one folder where as the palnets model in a separate folder. the relation between a router and a controller is always one to one. where as 
the data from planets model could be needed in multiple places. We can keep the planets modle with controller and routes
So as general prctice it is good to have the planets model in a separate folder.
*/

const {parse} = require ('csv-parse');
const path = require ('path');
const fs = require('fs');


const results = [];

const habitabalPanets = [];

function isHabitableplanet(planet){
    return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6 ;
}

//as we are reading this data from a stream , and stream is a asynchronous process.
//node won't wait arround for the stream to read the planets data
//all of the code in the planets model gets executed once we require it in the planets controller

/*
To keep our planets data available when server is ready fro accepting request, we have added the code for reading the planets data inside a promise
while will resolve once we have some planets data or rwject if any comes up

*/
function loadPlanetsData(){

    return new Promise((resolve, reject) =>{
      //we have used the path here to get the location of the planets csv file
    fs.createReadStream(path.join(__dirname,'..','..','data','kepler_data.csv'))
    .pipe(parse({
        comment: '#',
        columns: true
    }))
    .on ('data', (data) =>{
        if(isHabitableplanet(data)){
            habitabalPanets.push(data)
        }
    })
    .on('error', (err) =>{
        console.log(err);
        reject(err);
    })
    .on('end', () =>{
        console.log(`${habitabalPanets.length} Habitable plantes found`)
        //once we log the data the promise will resolve
        resolve();
    });
    });

}

function getAllPlanets(){
    return habitabalPanets;
}


//it can happen that node wiil export planets while the data is getting read by the stream
//if at that moment from FE we received any request for the planets we may still be readin the data at that moemnt
//here we are also exporting the loadPlanets data as we want it to be executed when planets model is required

module.exports = {
    loadPlanetsData,
    getAllPlanets,
} ;
