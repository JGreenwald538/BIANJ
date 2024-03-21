import mongoose from 'mongoose';
import MongoPlace from './schema';
import { Client } from 'pg'
import sql from 'sql-template-strings'

const MONGODB_URL = "mongodb+srv://jackgreenwald4:zObvxbvG2upLxRmy@cluster0.aosqcc9.mongodb.net/Main?retryWrites=true&w=majority"

const POSTGRES_URL = "postgresql://JGreenwald538:zuTLI97vPFlD@ep-divine-lake-a4yurtib-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"

await mongoose.connect(MONGODB_URL)

const postgres = new Client(POSTGRES_URL)
await postgres.connect()

const places = await MongoPlace.find()

await postgres.query(sql`
  DROP TABLE IF EXISTS places;
`)

await postgres.query(sql`
  CREATE TABLE IF NOT EXISTS places (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT NOT NULL,
    "typeOfPlace" TEXT NOT NULL,
    invisible BOOLEAN NOT NULL DEFAULT FALSE,
    
    website TEXT NOT NULL,
    phone TEXT NOT NULL,
    image TEXT,
    reviews TEXT[] NOT NULL,

    "streetAddress" TEXT NOT NULL,
    city TEXT NOT NULL,
    zip TEXT NOT NULL,
    state TEXT NOT NULL,
    
    long DOUBLE PRECISION NOT NULL,
    lat DOUBLE PRECISION NOT NULL
  );
`)

await postgres.query(sql`DELETE FROM places;`)

for (const place of places) {
  const p = place.toJSON()
  const query = sql`
    INSERT INTO places (
      name, "typeOfPlace", website, phone, image, reviews, "streetAddress", city, zip, state, long, lat
    ) VALUES (
      ${p.name}, ${p.typeOfPlace}, ${p.website}, ${p.phone}, ${p.image}, ${p.reviews}, ${p.streetAddress}, ${p.city}, ${p.zip}, ${p.state}, ${p.long}, ${p.lat}
    );
  `
  console.log(query)
  await postgres.query(query)
}

await postgres.end()