/*
before designing a model we need to think about what are the data points that will be required from it. A unique identifier of it
by using which user can search for a launch
while for a launch Launch Date, Mission Name, Rocket Type, Destination Exoplanet is required. In upcoming and history page there are fields like 	No., Rocket, Customers
are also required from a lauch
We also have to have some additional fields like whther the launch was successful or not.
*/
const axios = require('axios');
const launchesDatabase = require ('./launches.mongo')
const planets = require('./planets.mongo');


const DEFAULT_FLIGHT_NUMBER = 100;

//As we are getting realtime data from spaceX api, We done need the launch object now.
// const launch = {
//     flightNumber: 100, //flight_number
//     mission: 'kepler Exploration X', //name
//     rocket: 'Explorer IS1',  //rocket.name
//     launchDate: new Date('December 27, 2030'), //date_local
//     target: 'Kepler-442 b',//not applicable
//     customers: ['ZTM', 'NASA'], //payload.customers for each payload
//     upcoming: true, //upcoming
//     success: true, //success
// };

// saveLaunch(launch);
/*
The Map object holds key-value pairs and remembers the original insertion order of the keys.
Any value (both objects and primitive values) may be used as either a key or a value.
*/
//Here whenever we look for launches model, it will look over the launch and get the launch wherever
//the flighnumber is matching

async function findLaunch(filter){
    return await launchesDatabase.findOne(filter)
}

 async function existsLaunchWithId(launchId){
    return await findLaunch({
        flightNumber:launchId,
    });
}

async function getLatestFlightNumber(){
    const latestLaunch = await launchesDatabase
    .findOne()
    .sort('-flightNumber');

    if(!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber;

}

async function getAllLaunches(skip, limit){
    return await launchesDatabase
    .find({},{'_id':0, '__v':0})
    .skip(skip)
    .sort({ flightNumber: 1 })
    .limit(limit)
}

async function scheduleNewLaunch(launch){
    const planet = await planets.findOne({
        keplerName: launch.target,
    });
    if (!planet){
        throw new Error('No matching planet found');
    }
    const newFlightNumber = await getLatestFlightNumber() + 1;

    const newlaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers : ['Sudam', 'CAW'],
        flightNumber : newFlightNumber,
    });

    await saveLaunch(newlaunch);
7}

// function addNewlaunch(launch){
//     //here it is difficult for a user to keep track of the flight numbers, so as we have the last flight number
//     //we will increase it by 1 every time a new request comes in
//     latestFlightNumber++;
//     launches.set(
//         latestFlightNumber,
//         //the Object.assign function will take an object in this case launch received from the request and add some additional fields
//         //which did't received from client
//         Object.assign(launch,{
//             success: true,
//             upcoming: true,
//             customers: ['Zero to Mastery', 'NASA'],
//             flightNumber: latestFlightNumber,
//         })
//     )
// }

async function saveLaunch(launch){
    await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch,{
        upsert: true,
    });
} 
const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches (){
    console.log('Downloading launched from space x');
    const response = await axios.post(SPACEX_API_URL, {
         query:{},
         options: {
             pagination: false,
             populate: [
                 {
                     path: 'rocket',
                     select:{
                         name:1
                     }
                 },
                 {
                     path: 'payloads',
                     select: {
                         'customers': 1
                     }
                 }
             ]
         }
     });

     if (response.status !== 200){
       console.log('Problem downloading launch data');
       throw new Error('Launch data download failed')
     }
     const launchDocs = response.data.docs;
     
     for(const launchDoc of launchDocs){
         const payloads = launchDoc['payloads'];
         const customers = payloads.flatMap((payload) =>{
          return payload['customers'];
         })
 
         const launch = {
             flightNumber: launchDoc['flight_number'],
             mission: launchDoc['name'],
             rocket: launchDoc['rocket']['name'],
             launchDate: launchDoc['date_local'],
             upcoming: launchDoc['upcoming'],
             success: launchDoc['success'],
             customers,
         };
         console.log(`${launch.flightNumber}  ${launch.mission}`);
         //TODO Populate launches collection
         await saveLaunch(launch);
     }
}

async function loadLaunchData(){
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    });
    if (firstLaunch){
      console.log('launch data already loaded');
    } else {
      await populateLaunches();
    }
   
}



async function abortLaunchById(launchId){
   const aborted =  await launchesDatabase.updateOne({
        flightNumber: launchId,
    },{
        upcoming : false,
        success : false,
    });
    return aborted.modifiedCount ===1;
    
    // const aborted = launches.get(launchId);
    // aborted.upcoming = false;
    // aborted.success = false;
    // return aborted;


}

module.exports = {
    loadLaunchData,
    existsLaunchWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById,
};