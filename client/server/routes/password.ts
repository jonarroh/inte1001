
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ChangePasswordDTO, createPasswordRecoveryDTO } from "../dto/passwordDTO";
import PasswordController from "../controller/password";


const password = new Hono();


password.post('/create', zValidator('json',createPasswordRecoveryDTO), async (c) => {

  const validated = c.req.valid('json')
  const controller = new PasswordController()

  const result = await controller.createRecoveryCode(validated.userId,validated.email)

  if(result.isOk){
    return c.json({message:'Correo enviado correctamente'})
  }
  return c.json({message:'Error al enviar el correo'},500)
})

password.post('/change', zValidator('json',ChangePasswordDTO), async (c) => {
  
    const validated = c.req.valid('json')
    const controller = new PasswordController()
  
    const result = await controller.changePassword(validated.userId,validated.newPassword,validated.code)
  
    if(result.isOk){
      return c.json({message:'Contraseña cambiada correctamente'})
    }
    console.log(result.error);
    return c.json({message:'Error al cambiar la contraseña'},500)
  }
)

export default password