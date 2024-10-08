// app/api/purchases/route.js
import { authOptions } from '../auth/[...nextauth]/route'; 
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/db'; 
export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  const { productName, price } = await req.json(); // Erwartet das Produkt und den Preis

  if (!productName || !price) {
    return new Response(JSON.stringify({ message: 'Invalid data' }), { status: 400 });
  }

  const { db } = await connectToDatabase();
  const user = await db.collection('users').findOne({ email: session.user.email });

  if (!user) {
    return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
  }

  const purchase = {
    userId: user._id,
    productName,
    price,
    date: new Date(),
  };

  await db.collection('purchases').insertOne(purchase);

  return new Response(JSON.stringify({ message: 'Purchase created successfully' }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
