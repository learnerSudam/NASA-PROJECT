const mongoose =  require('mongoose');

const launchesSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true,
    },
    launchDate: {
        type: Date,
        require: true,
    },
    mission: {
        type: String,
        required: true,
    },
    rocket: {
        type: String,
        required: true,
    },
/*
For target as it is a planet e could have referenced it from planet cdocument
by 
type: mongoose.ObjectId,
ref: 'Planet'
but by doing this we are following the sql approach which actually makes our life difficult
The data from our planet that we actually care about is just
name
*/
    target: {

        type: String,
    },
    customers: [String],
    upcoming: {
        type: Boolean,
        required: true,
    },
    success:{
        type: Boolean,
        required: true,
        //in case of no success property given true will be assigned
        default: true,
    }
});
//connects launchesSchema with the "launches" collectio
module.exports = mongoose.model('Launch', launchesSchema);