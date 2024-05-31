const {
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
} = require('../../models/launches.model');

const {
  getPagination
} = require('../../services/query');
async function httpGetAllLaunches (req, res){
    const{skip, limit} = getPagination(req.query);
    const launches = await getAllLaunches(skip, limit)
 return res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res){
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
    try{
      await scheduleNewLaunch(launch);
      return res.status(201).json(launch);
    } catch (error){
      res.status(404).json({ error: error.message });
    }

}

async function httpAbortLaunch(req, res){
  const launchId = Number(req.params.id);
//if launch doesn't exist
const existsLaunch = await existsLaunchWithId(launchId);
  if(!existsLaunch){
    return res.status(404).json({
        error: 'Launch not found'
    });
  }
  const aborted = await abortLaunchById(launchId);
  if(!aborted){
    return res.status(400).json({
        error: 'Launch not aborted',
    })
  }
  return res.status(200).json({
    ok: true
  });
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
}