import express from "express";

import { 
    autenticar,
    registrar,
    perfil,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword 
} from "../controllers/veterinarioControllers.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

//Area publica
router.post('/', registrar);
router.get('/confirmar/:token', confirmar);
router.post('/login', autenticar);
router.post('/olvide-password', olvidePassword);
//Express
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword)

//Area Privada
router.get('/perfil', checkAuth ,perfil);
router.put('/perfil/:id' , checkAuth , actualizarPerfil);
router.put('/actualizar-password' , checkAuth , actualizarPassword);

export default router;