import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Bitte füge deine Mongo URI in .env.local hinzu');
}

const uri = process.env.MONGODB_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {

  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
 
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  if (!clientPromise) {
    throw new Error("MongoClient wurde nicht richtig initialisiert.");
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME); 
    return { client, db };
  } catch (error) {
    console.error("Verbindung zur Datenbank fehlgeschlagen:", error);
    throw new Error("Datenbankverbindung fehlgeschlagen");
  }
}

export default clientPromise;
