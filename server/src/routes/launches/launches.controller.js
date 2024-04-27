const {
    getAllLaunches,
    addNewlaunch,
    existsLaunchWithId,
    abortLaunchById,
} = require('../../models/launches.model');

function httpGetAllLaunches (req, res){
 return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res){
    const launch = req.body;
    //Here we are checking for the falsy of the required fields, if true error will be thrown
    if(!launch.launchDate || !launch.mission || !launch.rocket || !launch.target ){
        return res.status(400).json({
            error: 'missing property required !!'
        })
    }
    launch.launchDate = new Date(launch.launchDate);

    //A valid date always gets converted to a number(a time stamp) and it will be number
    //If it is not a valid date , it will be a NaN and in case of NaN error will be thrown
    if(isNaN(launch.launchDate)){
        return res.status(400).json({
            error: 'Invalid date !!'
        })
    }

    addNewlaunch(launch);
    res.status(201).json(launch);

}

function httpAbortLaunch(req, res){
  const launchId = Number(req.params.id);
//if launch doesn't exist
  if(!existsLaunchWithId(launchId)){
    return res.status(404).json({
        error: 'Launch not found'
    });
  }
  const aborted = abortLaunchById(launchId);
  return res.status(200).json(aborted);
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
}