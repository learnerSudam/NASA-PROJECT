/*
before designing a model we need to think about what are the data points that will be required from it. A unique identifier of it
by using which user can search for a launch
while for a launch Launch Date, Mission Name, Rocket Type, Destination Exoplanet is required. In upcoming and history page there are fields like 	No., Rocket, Customers
are also required from a lauch
We also have to have some additional fields like whther the launch was successful or not.
*/

const launches = new Map();

let latestFlightNumber = 100;

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
/*
The Map object holds key-value pairs and remembers the original insertion order of the keys.
Any value (both objects and primitive values) may be used as either a key or a value.
*/
//Here whenever we look for launches model, it will look over the launch and get the launch wherever
//the flighnumber is matching
launches.set(launch.flightNumber,launch);

function existsLaunchWithId(launchId){
    return(launches.has(launchId));
}

function getAllLaunches(){
    return Array.from(launches.values());
}

function addNewlaunch(launch){
    //here it is difficult for a user to keep track of the flight numbers, so as we have the last flight number
    //we will increase it by 1 every time a new request comes in
    latestFlightNumber++;
    launches.set(
        latestFlightNumber,
        //the Object.assign function will take an object in this case launch received from the request and add some additional fields
        //which did't received from client
        Object.assign(launch,{
            success: true,
            upcoming: true,
            customers: ['Zero to Mastery', 'NASA'],
            flightNumber: latestFlightNumber,
        })
    )
}

function abortLaunchById(launchId){
    const aborted = launches.get(launchId);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
}

module.exports = {
    existsLaunchWithId,
    getAllLaunches,
    addNewlaunch,
    
    abortLaunchById,
};