import express from "express";
import { router as routerUsers } from "./routes/usersRoutes";
import { router as routerAppointments } from "./routes/appointmentsRoutes";
import { router as portfolioAppointments } from "./routes/portfolioRoutes";
import 'dotenv/config';
import { AppDataSource } from "./db";
import cors from "cors"

const app = express()

const PORT = process.env.PORT || 4000

app.use(express.json())
app.use(cors())
app.use("/user", routerUsers)
app.use("/appointment", routerAppointments)
app.use("/portfolio", portfolioAppointments)

AppDataSource.initialize()
    .then(() => {
        console.log('Database connected');
        app.listen(PORT, () => {
            console.log("running server on " + PORT);
        })
    })
    .catch(error => {
        console.log(error);
    });