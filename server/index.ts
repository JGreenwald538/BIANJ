import {Elysia} from "elysia";
import * as mongoose from 'mongoose'
import Place from "./schema";

await mongoose.connect(process.env.DATABASE_URL!)

const app = new Elysia()
  .get('/', async (ctx) => {
    const places = await Place.find();
    ctx.set.headers['content-type'] = 'application/json';
    return places;
  })

app.listen({
  hostname: '0.0.0.0',
  port: 3000,
})