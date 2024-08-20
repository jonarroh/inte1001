import { Hono } from 'hono'
import { jwt,sign,decode,verify } from 'hono/jwt'
import type { JwtVariables } from 'hono/jwt'
import { selectUsers } from '../db/schema/users'
import { zValidator } from '@hono/zod-validator'
import { loginDTO } from '../dto/auth/login'
import AuthController from '../controller/auth'

type Variables = JwtVariables

const auth = new Hono<{ Variables: Variables }>()


auth.post('/login',zValidator('form',loginDTO), async (c) => {
  const validated = c.req.valid('form')
  const controller = new AuthController()
  const result = await controller.login(validated.email,validated.password)
  if(result.isOk){
    const token = await controller.createAuth(result.value!)
    console.log(token)
    return c.json({token})
  }
  return c.json({error:result.error},500)
})


export default auth

