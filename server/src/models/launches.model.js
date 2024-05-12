/*
before designing a model we need to think about what are the data points that will be required from it. A unique identifier of it
by using which user can search for a launch
while for a launch Launch Date, Mission Name, Rocket Type, Destination Exoplanet is required. In upcoming and history page there are fields like 	No., Rocket, Customers
are also required from a lauch
We also have to have some additional fields like whther the launch was successful or not.
*/

const launchesDatabase = require ('./launches.mongo')
const planets = require('./planets.mongo');


const DEFAULT_FLIGHT_NUMBER = 100;


const launch = {
    flightNumber: 100,
    mission: 'kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,
};

saveLaunch(launch);
/*
The Map object holds key-value pairs and remembers the original insertion order of the keys.
Any value (both objects and primitive values) may be used as either a key or a value.
*/
//Here whenever we look for launches model, it will look over the launch and get the launch wherever
//the flighnumber is matching

 async function existsLaunchWithId(launchId){
    return await launchesDatabase.findOne({
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

async function getAllLaunches(){
    return await launchesDatabase
    .find({},{'_id':0, '__v':0});
}

async function scheduleNewLaunch(launch){
    const newFlightNumber = await getLatestFlightNumber() + 1;

    const newlaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers : ['Sudam', 'SDET'],
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
    const planet = await planets.findOne({
        keplerName: launch.target,
    });
    if (!planet){
        throw new Error('No matching planet found');
    }
    await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch,{
        upsert: true,
    });
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
    existsLaunchWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById,
};