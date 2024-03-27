import "dotenv/config";
import env from "./util/validateEnv"
import app from "./app"
import mongoose from "mongoose";

const port = env.PORT;

mongoose.connect(env.DB_CONNECTION_STRING)
    .then(() => {
        console.log("Mongoose connected");
        app.listen(port, () => {
            console.log("Server running on port: " + port);
        });
    });
