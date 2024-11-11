import { Hono } from "hono";
import { cors } from 'hono/cors'
import taco from "./routes/taco";
import auth from "./routes/auth";
import badge from "./routes/badge";
import leagues  from "./routes/leagues";
import location from "./routes/location";
import email from "./routes/email";
import { createBunWebSocket } from 'hono/bun'
import LocationController from "./controller/location";
import web from "./routes/webPush";
import { insertLocation } from "./db/schema/location";
import password from "./routes/password";
import logger from "./routes/logger";
const app = new Hono();
const { upgradeWebSocket, websocket } =
  createBunWebSocket()

app.use(cors(
  {
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  }
));

app.route('/taco', taco);
app.route('/auth', auth);
app.route('/badge', badge);
app.route('/leagues', leagues);
app.route('/location', location);
app.route('/email',email);
app.route('/web', web);
app.route('/logging', logger)
app.route('/password', password)
app.get(
  '/ws',
  upgradeWebSocket(() => {
    return {
       onMessage(event, ws) {
        const message = JSON.parse( event.data.toString())

        // Identificar el tipo de evento y manejarlo
        const controller = new LocationController();
        switch (message.type) {
          case 'onLogin': {
            console.log(`User logged in: ${message.username}`)
            const location:insertLocation = {
              isLogged: message.isLogged,
              latitude: message.latitude,
              longitude: message.longitude,
              token: message.token,
              browser: message.browser,
              deviceType: message.deviceType
            }
            controller.addNewLocation(location);

            ws.send(`Welcome ${message.username}!`)
            break
          }
          case 'onLogout':
            controller.deleteLocation(message.token);
            ws.send(`Goodbye ${message.username}!`)
            break
          default:
            console.log(`Unknown event: ${message.type}`)
            ws.send('Unknown event received')
        }
      },
      onClose: () => {
        console.log('Connection closed')
      },
    }
  })
)

export default {
  fetch: app.fetch,
  websocket,
}