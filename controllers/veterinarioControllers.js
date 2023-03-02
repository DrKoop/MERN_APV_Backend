import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarid.js";
import emailResgistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar =  async (req, res) => {
    //const { nombre,email, password } = req.body;

    //Prevenir usuarios duplicados => por correo
    const { email, nombre } = req.body;
    const existeUsuario = await Veterinario.findOne({ email });
    if(existeUsuario){
       const error = new Error('USUARIO DUPLICADO ...');
       return res.status(400).json({ msg : error.message });
    }

    try {
        //Guardando un Nuevo Registro
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();
        //Enviar el email
        emailResgistro({
            email,
            nombre,
            token : veterinarioGuardado.token
        });
        res.json(veterinarioGuardado);
    } catch (error) {
        console.log(error)
    }
};


const perfil = (req, res) => {

    const {veterinario } = req;
    
    res.json({ perfil : veterinario });
};



const confirmar = async (req, res) => {
     const { token } = req.params;
    //Buscando usuario en la Bd que contenga el mismo Token => confirmar la cuenta
    const usuarioConfirmar = await Veterinario.findOne({ token });

    if(!usuarioConfirmar){
        const error = new Error('Token no valido');
        return res.status(404).json({ msg: error.message });
    }
    //Modificar la peticion a true ( usuarios confirmado ) y eliminando el parametro de token
    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();
        res.json({ msg : 'usuario Confirmado Correctamente ...'});
    } catch (error) {
        console.log(error)
    }
};



const autenticar = async (req, res) => {

    const { email, password } = req.body;
    //Comprobando si el usuario existe
    const usuario = await Veterinario.findOne({email})

    if(!usuario){
        const error = new Error('El usuario no existe');
        return res.status(404).json({ msg: error.message });
    }
    //Validar si el usuario esta confirmado
    if(!usuario.confirmado){
        const error = new Error('Tu cuenta aun no ha sido confirmada')
        return res.status(403).json({ msg: error.message})
    }

    //Comprobar password
    if( await usuario.comprobarPassword(password)){
        
        res.json({
            _id : usuario._id,
            nombre : usuario.nombre,
            email : usuario.email,
            token : generarJWT(usuario.id)
        });
    }else{
        const error = new Error('El password es incorrecto')
        return res.status(400).json({ msg: error.message})
    }
    //Usuario Autenticado  
};

const olvidePassword = async (req,res) => {
    const { email } = req.body;

    const existeVeterinario = await Veterinario.findOne({ email });

    if(!existeVeterinario){
        const error = new Error('Usuario No valido ')
        return res.status(400).json({ msg : error.message})
    }

    //Si existe el usuario generar un nuevo token
    try {
        existeVeterinario.token = generarId();
        await existeVeterinario.save();
        //Enviar email con instrucciones
        emailOlvidePassword({
            email,
            nombre : existeVeterinario.nombre,
            token: existeVeterinario.token
        });
        res.json({ msg : "Hemos enviado un email con las instrucciones para recuperar tu cuenta."})
    } catch (error) {
        console.log(error)
    }

}

const comprobarToken =  async(req,res) => {
    const { token } = req.params;
    const tokenValido = await Veterinario.findOne({ token });

    if(tokenValido){
        res.json({ msg : 'Token valido y el usuario existe'})
    }else{
        const error = new Error('Token No valido ')
        return res.status(400).json({ msg : error.message})
    }

}

const nuevoPassword = async (req,res) => {
    const { token } = req.params;
    const { password } = req.body;

    const veterinario = await Veterinario.findOne({ token })

    if(!veterinario){
        const error = new Error('Hubo un error')
        return res.status(400).json({ msg : error.message})
    }

    //reescribimos las propiedad que se van a modificar
    try {
       veterinario.token = null;
       veterinario.password = password; 
       await veterinario.save();
       res.json({ msg : "Password Modificado Correctamente."})
    } catch (error) {
        console.log(error)
    }
}


 const actualizarPerfil = async (req, res) => {
 
    const { id } = req.params;

    
    
    const veterinario = await Veterinario.findById(id);

    
    console.log(veterinario)


    if(!veterinario){
        const error = new Error('Ocurrio un Error')
        return res.status(400).json({ msg: error.message })
    }

    //El usuario intenta introducir un correo ya existente en la Bd
    const { email } = req.body;
    if( veterinario.email !== veterinario.email ){
        const existeEmail = await Veterinario.findOne({ email });

        if(existeEmail){
            const error = new Error('Ese email ya esta en uso')
            return res.status(400).json({ msg: error.message })
        }
    }

    try {
        veterinario.nombre = req.body.nombre 
        veterinario.email = req.body.email 
        veterinario.web = req.body.web 
        veterinario.telefono = req.body.telefono 

        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado)
    } catch (error) {
        console.log(error)
    }
 }



 const actualizarPassword = async ( req, res ) => {
    //const { id } = req.veterinario;
    const { pwd_actual, pwd_nuevo } = req.body;

    
    const veterinario = await Veterinario.findById(req.params.id);

    if(!veterinario){
        const error = new Error('Ocurrio un Error')
        return res.status(400).json({ msg: error.message })
    }

    if( await veterinario.comprobarPassword(pwd_actual) ){
        veterinario.password = pwd_nuevo;
        await veterinario.save();
        res.json({ msg : 'Password Almacenado Correctamente'})
    }else{
        const error = new Error('El password actual es Incorrecto')
        return res.status(400).json({ msg: error.message })
    }
 }

export {
    autenticar,
    registrar,
    olvidePassword,
    perfil,
    confirmar,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
};