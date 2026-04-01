const app = require("./app");
const config = require("./app/config");
const MongoDB = require("./app/utils/mongodb.util");
const mongoose = require("mongoose");

async function startServer() {
    try {
        await MongoDB.connect(config.db.uri);

        await mongoose.connect(config.db.uri);
        console.log("✅ Mongoose connected");

        console.log("Connected to the database!.");

        const PORT = config.app.port || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}.`);
        });
    } catch (error) {
        console.error("❌ Error connecting to the database:", error);
        process.exit();
    }
}

startServer();