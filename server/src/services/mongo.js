const mongoose = require('mongoose');

const MONGO_URL= 'mongodb+srv://nasa-api:vtzbTYuO8DlMdBt6@nasa.ejmjfjq.mongodb.net/nasa?retryWrites=true&w=majority&appName=Nasa';


mongoose.connection.on('open', () =>{
    console.log('MongoDB Connection ready')
});

mongoose.connection.on('error', ()=>{
    console.error('err');
});

async function mongoConnect(){
    await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect(){
    await mongoose.disconnect();
}


module.exports = {
    mongoConnect,
    mongoDisconnect,
}