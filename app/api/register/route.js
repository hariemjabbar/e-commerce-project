// app/api/register/route.js
import { connectToDatabase } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { email, password, fullName } = await req.json(); // Fügen Sie fullName hinzu
    const { db } = await connectToDatabase();

    // Überprüfen, ob der Benutzer bereits existiert
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: 'User already exists' }), { status: 400 });
    }

    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 10);

    // Neuen Benutzer einfügen
    await db.collection('users').insertOne({ email, password: hashedPassword, fullName }); // Speichern Sie den Namen hier

    return new Response(JSON.stringify({ success: true }), { status: 201 }); // Ändern Sie den Statuscode zu 201 für erfolgreiches Erstellen
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 }); // Interne Serverfehler
  }
}
