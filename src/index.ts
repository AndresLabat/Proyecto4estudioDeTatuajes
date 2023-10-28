import express from "express";
import { router as routerUsers } from "./routes/usersRoutes";
import { router as routerAppointments } from "./routes/appointmentsRoutes";
import { AppDataSource } from "./db";

const app = express()
const PORT = process.env.PORT || 4000

app.use(express.json())
app.use("/user", routerUsers)
app.use("/appointment", routerAppointments)

AppDataSource.initialize()
.then(() => {
    console.log('Database connected');
    app.listen(PORT, ()=>{
        console.log("running server on " + PORT);
    })
    })
    .catch(error => {
        console.log(error);
    });