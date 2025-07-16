const mongoose = require("mongoose")

const connectDB = async (url) =>{
    try {
       const conn = await mongoose.connect(url);
       console.log(`Connected to the ${conn.connection.db.databaseName}...`) 
    } catch (error) {
        console.log(error)
        process.exit(1);
    }
}

module.exports = connectDB;