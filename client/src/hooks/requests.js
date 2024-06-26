const API_URL = 'v1';

 // Load planets and return as JSON.
async function httpGetPlanets() {
  const response = await fetch(`${API_URL}/planets`);
 return await response.json();
}

async function httpGetLaunches() {
  // Load launches, sort by flight number, and return as JSON.
  const response = await fetch(`${API_URL}/launches`);
  const fetchedLaunches = await response.json();
  /*
  here to sort the returned launches we are using the sort function(which expects a negative number). if the flight number of the first(a)
  is smaller then second flightnumber(b) it will return a negative number , 
  */
  return fetchedLaunches.sort((a, b)=>{
    return a.flightNumber - b.flightNumber;
  })
}

async function httpSubmitLaunch(launch) {
try {
  return  await fetch(`${API_URL}/launches`, {
    method: 'post',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(launch),
  }) ;
} catch (err){
    return{
      ok:false,
    };
}
};

async function httpAbortLaunch(id) {
 try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: 'delete',
    });
 } catch(err){
  console.log(err);
  return{
    ok: false,
  };
 }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};