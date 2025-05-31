import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { PrismaClient } from "./generated/prisma/index.js";
import { mainRouter } from "./routes/indexRoute.js";

const app = new Hono()
export const db = new PrismaClient()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.use('*', async (c, next) => {
  c.res.headers.set('Access-Control-Allow-Origin', 'http://localhost:5173')
  c.res.headers.set('Access-Control-Allow-Credentials', 'true')
  c.res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
  c.res.headers.set('Access-Control-Allow-Headers', 'Content-Type')
  if (c.req.method === 'OPTIONS') {
    return c.json({}, 200)
  }
  return next()
})

app.route('/', mainRouter)

db.$connect()
    .then(() => {
      console.log("Connected to the database");
      serve({
        fetch: app.fetch,
        port: 3000
      }, (info) => {
        console.log(`Server is running on http://localhost:${info.port}`)
      })
    })
    .catch((error ) => {
      console.error("Error connecting to the database:", error);
    });