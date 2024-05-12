const http = require('http');
const app = require('./app');
const {mongoConnect} = require('./services/mongo');
/*
here we have kept the express initilazion in another file 
as it is just a request listener and can be added on top of http server of node module
*/

//by requireing loadPalanets data here, we are calling the loadPlanets function
const {loadPlanetsData} = require('./models/planets.model');


 const PORT =process.env.PORT || 8000;     //here we will use the default port set by the env variable                     
const server = http.createServer(app);      //if not present we wiil use the specified port 8000


//as loadPlanetsData is a promise, we need to await for the promise and await can only be used inside async function
//for that we hav created the async startServer function and inside the function
//we are loading the planets data nd starting listening requests on the server
async function startServer(){
    await mongoConnect();
    await loadPlanetsData();
    
    server.listen(PORT, () =>{
        console.log(`Listening on port ${PORT}..`)
    });
};

startServer();



