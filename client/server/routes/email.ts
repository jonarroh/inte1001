import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { customToEmailDTO, emailDTO, sendToEmailDTO } from "../dto/emailDTO";
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


email.post('/sendToEmail', async (c) => {
  const framework = await c.req.json()
  const controller = new EmailController()

  const result = await controller.sendEmailTo({
    message: framework.message,
    framework: framework.framework
  })

  if(result){
    return c.json({message:'Correo enviado correctamente'})
  }
  return c.json({message:'Error al enviar el correo'},500)
})

email.post('/customToEmail',zValidator('json',customToEmailDTO), async (c) => {
  const validated = c.req.valid('json')
  console.log(validated);
  console.log("validated");
  const controller = new EmailController()


  const result = await controller.sendEmail({
    to: validated.subject,
    subject: "Correo personalizado",
    htmlBody: validated.message
  })

  if(result){
    return c.json({message:'Correo enviado correctamente'})
  }
  return c.json({message:'Error al enviar el correo'},500)
}
)


export default email