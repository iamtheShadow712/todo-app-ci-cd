const connectDB = require('./db')
const { app } = require('./app')
require('dotenv').config()

const PORT = process.env.PORT || 3000

connectDB(process.env.MONGO_URI).then(() => {
    app.listen(PORT, () => {
        console.log("Server running on port: " + PORT);
    });
})