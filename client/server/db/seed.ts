
import { db } from ".";
import * as schema from "./schema";

await db.insert(schema.tennis).values([
  {
    marca: 'Nike',
    modelo: 'Air Max',
    precio: 100.00,
    descripcion: 'Zapatillas de deporte',
    imagen: 'hhttps://via.placeholder.com/600/92c952'
  },
  {
    marca: 'Adidas',
    modelo: 'Superstar',
    precio: 80.00,
    descripcion: 'Zapatillas de deporte',
    imagen: 'https://via.placeholder.com/600/771796'
  },
  {
    marca: 'Puma',
    modelo: 'Suede',
    precio: 90.00,
    descripcion: 'Zapatillas de deporte',
    imagen: 'https://via.placeholder.com/600/24f355'
  },
  {
    marca: 'Reebok',
    modelo: 'Classic',
    precio: 70.00,
    descripcion: 'Zapatillas de deporte',
    imagen: 'https://via.placeholder.com/600/d32776'
  }
]);

await db.insert(schema.categories).values([
  { name: 'Running' },
  { name: 'Basketball' },
  { name: 'Lifestyle' },
]);

// Seed data for reviews table
await db.insert(schema.reviews).values([
  {
    tennisId: 1,
    rating: 5,
    comment: 'Great shoes, very comfortable!'
  },
  {
    tennisId: 2,
    rating: 4,
    comment: 'Stylish and durable.'
  },
  {
    tennisId: 3,
    rating: 3,
    comment: 'Good value for the price.'
  },
  {
    tennisId: 4,
    rating: 4,
    comment: 'Classic design, always reliable.'
  }
]);

// Seed data for tennisCategories (N:M relationship) table
await db.insert(schema.tennisCategories).values([
  { tennisId: 1, categoryId: 1 }, // Nike Air Max in Running
  { tennisId: 2, categoryId: 3 }, // Adidas Superstar in Lifestyle
  { tennisId: 3, categoryId: 3 }, // Puma Suede in Lifestyle
  { tennisId: 4, categoryId: 2 }, // Reebok Classic in Basketball
]);


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