import express from "express"
import core from "cors"
import cookieParser from "cookie-parser"
import { errorHandler } from "./middlewares/errorHandler.middleware.js"

const app = express()


app.use(core({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.urlencoded({ limit: "16kb", extended: true }))
app.use(cookieParser())
app.use(express.json())
app.use(express.static("public"))


// import routes

// use router

// error handler
app.use(errorHandler)


export { app }