
import { db } from ".";
import * as schema from "./schema";
import { faker } from "@faker-js/faker";

// export async function seedLocationData() {
//   const locations = Array.from({ length: 1000 }).map(() => ({
//     latitude: faker.location.latitude(),
//     longitude:faker.location.longitude(),
//     isLogged: faker.number.int({ min: 0, max: 1 }), // 0 or 1
//     token: faker.string.uuid(),
//     browser: faker.internet.userAgent().split(" ")[0], // Gets the browser name from the user agent
//     deviceType: faker.helpers.arrayElement(["Desktop", "Mobile", "Tablet"]),
//     createdAt: faker.date.recent({ days: 365 }).toISOString().replace("T", " ").slice(0, 19) // Formats date as 'YYYY-MM-DD HH:MM:SS'
//   }));

//   try {
//     for (const loc of locations) {
//       await db.insert(schema.location).values(loc);
//     }
//     console.log("Seed data inserted successfully!");
//   } catch (error) {
//     console.error("Error seeding location data:", error);
//   }
// }

// await seedLocationData();
// export const ExternalUserInteractions = sqliteTable('external_user_interactions', {
//   id: integer('id').primaryKey(),
//   userId: integer('user_id').notNull(),
//   interactionType: text('interaction_type',{
//     enum: ['email', 'sms', 'whatsapp']
//   }).notNull(),
//   interactionData: text('interaction_data'),
//   subject: text('subject'),
//   interactionAt: text('interaction_at').notNull().default(sql`(current_timestamp)`),
// });
 const ExternalData =async ()=>{

  const extermalData = Array.from({ length: 1000 }).map(() => ({
    userId: faker.number.int({ min: 1, max: 20 }),
    interactionType: faker.helpers.arrayElement(['email', 'sms', 'whatsapp']),
    interactionData: faker.lorem.sentence(),
    subject: [
      faker.lorem.words()
    ],
    interactionAt: faker.date.recent({ days: 365 }).toISOString().replace("T", " ").slice(0, 19) // Formats date as 'YYYY-MM-DD HH:MM:SS'
  }));

  try {
    for (const loc of extermalData) {
      await db.insert(schema.ExternalUserInteractions).values({
        userId: loc.userId,
        interactionType: loc.interactionType,
        interactionData: loc.interactionData,
        subject:"urieher@gmail.com",
        interactionAt: loc.interactionAt
      });
    }
    console.log("Seed data inserted successfully!");
  } catch (error) {
    console.error("Error seeding location data:", error);
  }


}

ExternalData()




// await db.insert(schema.users).values([
//   {
//     name:'indie rodriguez',
//     email:'inde@zip.com',
//     password:'1234',
//     role:'admin',
//   },
//   {
//     name:'jose rodriguez',
//     email:'sas@com',
//     password:'1234',
//     role:'user',
//   },
//   {
//     name:'luis rodriguez',
//     email:'dasda@com',
//     password:'1234',
//     role:'inventory',
//   },
// ]);

// const badgesData = [
//   {
//     name: 'Novato',
//     description: 'Gana tu primer badge.',
//     pointsRequired: 10,
//   },
//   {
//     name: 'Intermedio',
//     description: 'Alcanza 50 puntos.',
//     pointsRequired: 50,
//   },
//   {
//     name: 'Avanzado',
//     description: 'Alcanza 100 puntos.',
//     pointsRequired: 100,
//   },
//   {
//     name: 'Experto',
//     description: 'Alcanza 200 puntos.',
//     pointsRequired: 200,
//   },
// ];

// const leaguesData = [
//   {
//     name: 'Bronce',
//     pointsRequired: 0, // Liga inicial
//   },
//   {
//     name: 'Plata',
//     pointsRequired: 100,
//   },
//   {
//     name: 'Oro',
//     pointsRequired: 250,
//   },
//   {
//     name: 'Platino',
//     pointsRequired: 500,
//   },
//   {
//     name: 'Diamante',
//     pointsRequired: 1000,
//   },
// ];

// const userLeaguesData = [
//   {
//     userId: 1,  // ID del usuario en tu base de datos
//     leagueId: 1, // ID de la liga (Bronce)
//     pointsAccumulated: 50,
//   },
//   {
//     userId: 2,
//     leagueId: 1,
//     pointsAccumulated: 120
//   },
//   {
//     userId: 3,
//     leagueId: 2, // Liga Plata
//     pointsAccumulated: 300,
//   },
//   {
//     userId: 4,
//     leagueId: 3, // Liga Oro
//     pointsAccumulated: 700
//   },
// ];




// await db.insert(schema.badges).values(badgesData);
// await db.insert(schema.leagues).values(leaguesData);

// await db.insert(schema.userLeagues).values(userLeaguesData);


// await db.insert(schema.userBadgesPoints).values([
//   { userId: 1, pointsAccumulated: 50 },
//   { userId: 2, pointsAccumulated: 120 },
//   { userId: 3, pointsAccumulated: 300 },
//   { userId: 4, pointsAccumulated: 700 },
// ]);

// await db.insert(schema.userLeaguesPoints).values([
//   { userId: 1, pointsAccumulated: 50 },
//   { userId: 2, pointsAccumulated: 120 },
//   { userId: 3, pointsAccumulated: 300 },
//   { userId: 4, pointsAccumulated: 700 },
// ]);


// console.log(`Seeding complete for table`);