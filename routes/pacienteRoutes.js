import  express  from "express";
const router = express.Router();
import { agregarPaciente, obtenerPacientes, obtenerPaciente,actualizarPaciente,eliminarPaciente } from "../controllers/pacienteController.js";
import checkAuth from "../middleware/authMiddleware.js";

router.route('/').post(checkAuth,agregarPaciente).get(checkAuth, obtenerPacientes);

//Obtener,actualizar,eliminar un paciente en especifico
router.route("/:id").get(checkAuth,obtenerPaciente).put(checkAuth,actualizarPaciente).delete(checkAuth,eliminarPaciente);


export default router;