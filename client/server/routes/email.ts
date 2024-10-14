import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { emailDTO } from "../dto/emailDTO";
import { EmailController } from "../controller/email";


const email = new Hono();


email.post('/',zValidator('json',emailDTO), async (c) => {
  const validated = c.req.valid('json')
  const controller = new EmailController()

  const result = await controller.sendEmail(validated)

  if(result){
    return c.json({message:'Correo enviado correctamente'})
  }
  return c.json({message:'Error al enviar el correo'},500)
}
)

export default email