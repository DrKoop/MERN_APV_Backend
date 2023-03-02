import nodemailer from "nodemailer";

const emailResgistro = async (datos) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        }
      });
      //Lee y extrae los datos del request
      const { email, nombre, token } = datos;
      //Envío email
      const info = await transporter.sendMail({
        from: 'APV - Administrador de Pacientes de Veterinaría',
        to : email,
        subject : 'Comprueba tu cuenta en APV.',
        text: 'Comprueba tu cuenta en APV.',
        html : `<p>Hola : ${nombre}, comprueba tu cuenta en APV.</p>
            <p>Tu cuenta ya esta lista, compruebala dando click en el siguiente enlace:
            <a href="process.env.FRONTEND_URL/confirmar/${token}">Comprobar Cuenta</a></p>
            <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje.</p>
        `
      });
      console.log("Mensaje enviado : %s", info.messageId)
};

export default emailResgistro;