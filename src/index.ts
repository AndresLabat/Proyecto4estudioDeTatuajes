import express from "express";
import { router as routerUsers } from "./routes/usersRoutes";

const app = express()
const PORT = process.env.PORT || 4000

app.use(express.json())
app.use("/user", routerUsers)

app.listen(PORT, ()=>{
    console.log("running server on " + PORT);
})