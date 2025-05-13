const mongoose = require('mongoose')

async function connectDB(DB_URI) {
    try {
        await mongoose.connect(DB_URI)
        console.log("Database connection successful")
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

module.exports = connectDB