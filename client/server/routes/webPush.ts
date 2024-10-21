import { Hono } from "hono";
import webpush from "web-push";
import { ENVS } from "../../utils/Env";
import { zValidator } from "@hono/zod-validator";
import { messageDTO, subscriptionDTO } from "../dto/pushDTO";
import { title } from "process";

webpush.setVapidDetails(`mailto:${ENVS.MAILER_USER}`, ENVS.PUBLIC_WEB_PUSH_KEY, ENVS.PRIVATE_WEB_PUSH_KEY);


const web = new Hono();


let pushSubscription: typeof subscriptionDTO._type;

web.post('/subscribe', zValidator('json',subscriptionDTO), async (c) => {
  const validated = c.req.valid('json');
  console.log("nueva suscripcion");

  pushSubscription = validated;
  

  return c.json({ message: 'Successfully subscribed to web push notifications' });
});


web.post('/push', zValidator('json',messageDTO), async (c) => {

  const validated = c.req.valid('json');
  console.log(pushSubscription);
  console.log(validated);

  const  payload = JSON.stringify(
    validated
  );
  


  try{
    await webpush.sendNotification(pushSubscription, payload);
  }
  catch(err){
    return c.json({ message: 'Error sending push notification' });
  }



  return c.json({ message: 'Push sent' });
});



export default web;

