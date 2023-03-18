import { Client } from 'faunadb'

interface FaunaDB {
  secret: string
}

export const fauna = new Client({
  secret: process.env.FAUNADB_KEY
} as FaunaDB)