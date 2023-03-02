import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conexionDB from "./config/db.js";
import veterinariosRoutes from "./routes/veterinarioroutes.js";
import pacienteRoutes from "./routes/pacienteRoutes.js";

const app = express();
app.use( express.json() );
dotenv.config();

conexionDB();

const dominiosPermitidos = [process.env.FRONTEND_URL]; 

const corsOptions = {
    origin : function(origin, callback){
        if( dominiosPermitidos.indexOf(origin) !== -1){
            //EL origen del Request es permitido
            callback(null , true)
        }else{
            callback( new Error('No permitido por CORS'))
        }
    }
};

app.use(cors(corsOptions));

app.use("/api/veterinarios" , veterinariosRoutes);

app.use("/api/pacientes" , pacienteRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor en el puerto : ${PORT}`)
});