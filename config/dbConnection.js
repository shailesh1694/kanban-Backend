
const mongoose = require('mongoose');

const dbConnection =  (url) => {

    mongoose.connect(`${url}/kanbanBoard`)
        .then((res) => {
            console.log("db Connected")
        })
        .catch((err)=>{
            console.log(err + "in Db")
        })

}

module.exports = dbConnection;