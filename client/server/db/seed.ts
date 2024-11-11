
import { db } from ".";
import * as schema from "./schema";
import { faker } from "@faker-js/faker";

export async function seedLocationData() {
  const locations = Array.from({ length: 100 }).map(() => ({
    latitude: faker.location.latitude(),
    longitude:faker.location.longitude(),
    isLogged: faker.number.int({ min: 0, max: 1 }), // 0 or 1
    token: faker.string.uuid(),
    browser: faker.internet.userAgent().split(" ")[0], // Gets the browser name from the user agent
    deviceType: faker.helpers.arrayElement(["Desktop", "Mobile", "Tablet"]),
    createdAt: faker.date.recent({ days: 365 }).toISOString().replace("T", " ").slice(0, 19) // Formats date as 'YYYY-MM-DD HH:MM:SS'
  }));

  try {
    for (const loc of locations) {
      await db.insert(schema.location).values(loc);
    }
    console.log("Seed data inserted successfully!");
  } catch (error) {
    console.error("Error seeding location data:", error);
  }
}

await seedLocationData();


await db.insert(schema.users).values([
  {
    name:'indie rodriguez',
    email:'inde@zip.com',
    password:'1234',
    role:'admin',
  },
  {
    name:'jose rodriguez',
    email:'sas@com',
    password:'1234',
    role:'user',
  },
  {
    name:'luis rodriguez',
    email:'dasda@com',
    password:'1234',
    role:'inventory',
  },
]);

const badgesData = [
  {
    name: 'Novato',
    description: 'Gana tu primer badge.',
    pointsRequired: 10,
  },
  {
    name: 'Intermedio',
    description: 'Alcanza 50 puntos.',
    pointsRequired: 50,
  },
  {
    name: 'Avanzado',
    description: 'Alcanza 100 puntos.',
    pointsRequired: 100,
  },
  {
    name: 'Experto',
    description: 'Alcanza 200 puntos.',
    pointsRequired: 200,
  },
];

const leaguesData = [
  {
    name: 'Bronce',
    pointsRequired: 0, // Liga inicial
  },
  {
    name: 'Plata',
    pointsRequired: 100,
  },
  {
    name: 'Oro',
    pointsRequired: 250,
  },
  {
    name: 'Platino',
    pointsRequired: 500,
  },
  {
    name: 'Diamante',
    pointsRequired: 1000,
  },
];

const userLeaguesData = [
  {
    userId: 1,  // ID del usuario en tu base de datos
    leagueId: 1, // ID de la liga (Bronce)
    pointsAccumulated: 50,
  },
  {
    userId: 2,
    leagueId: 1,
    pointsAccumulated: 120
  },
  {
    userId: 3,
    leagueId: 2, // Liga Plata
    pointsAccumulated: 300,
  },
  {
    userId: 4,
    leagueId: 3, // Liga Oro
    pointsAccumulated: 700
  },
];




await db.insert(schema.badges).values(badgesData);
await db.insert(schema.leagues).values(leaguesData);
await db.insert(schema.userBadges).values([
  { userId: 1, badgeId: 1 }, // Novato
  { userId: 2, badgeId: 2 }, // Intermedio
  { userId: 3, badgeId: 3 }, // Avanzado
  { userId: 4, badgeId: 4 }, // Experto
]);
await db.insert(schema.userLeagues).values(userLeaguesData);


await db.insert(schema.userBadgesPoints).values([
  { userId: 1, pointsAccumulated: 50 },
  { userId: 2, pointsAccumulated: 120 },
  { userId: 3, pointsAccumulated: 300 },
  { userId: 4, pointsAccumulated: 700 },
]);

await db.insert(schema.userLeaguesPoints).values([
  { userId: 1, pointsAccumulated: 50 },
  { userId: 2, pointsAccumulated: 120 },
  { userId: 3, pointsAccumulated: 300 },
  { userId: 4, pointsAccumulated: 700 },
]);


console.log(`Seeding complete for table`);