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
import authRouter from "./routes/auth.route.js"
import employeeRouter from "./routes/employee.route.js"
import serviceRouter from "./routes/service.route.js"
import customerRouter from "./routes/customer.route.js"

// use router
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/employees", employeeRouter)
app.use("/api/v1/services", serviceRouter)
app.use("/api/v1/customers", customerRouter)

// error handler
app.use(errorHandler)


export { app }