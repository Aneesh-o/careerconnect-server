const mongoose = require('mongoose')

const connectinString = process.env.DBCONNECTIONSTRING

mongoose.connect(connectinString).then(res => {
    console.log("Mongodb atlas connected successfully with careerconnect server");
}).catch(errr => {
    console.log('Mongodb atlas connectin failed');
    console.log(errr);
})