import { app } from "./app.js";
import dotenv from "dotenv"
import { connectDB } from "./db/connectDB.js";

dotenv.config({
    path: '.env'
})

const port = process.env.PORT || 5000

connectDB().then(() => {
    app.on("error", (error) => {
        console.log(`something want wrong while run the express server`);
    })

    app.listen(port, () => {
        console.log(`server run on port No: ${port}`);
    })
}).catch((error) => {
    console.log(`something want wrong while connecting to DB || ${error}`);

})