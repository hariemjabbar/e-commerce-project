import { authOptions } from '../auth/[...nextauth]/route';// Stellen Sie sicher, dass dieser Pfad korrekt ist
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/db'; // Stellen Sie sicher, dass der Pfad korrekt ist

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  const { db } = await connectToDatabase();
  const user = await db.collection('users').findOne({ email: session.user.email });

  if (!user) {
    return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
  }

  return new Response(JSON.stringify(user), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function PUT(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  const userData = await req.json();
  const { db } = await connectToDatabase();

  const result = await db.collection('users').updateOne(
    { email: session.user.email },
    { $set: { fullName: userData.fullName, phone: userData.phone } }
  );

  if (result.modifiedCount === 0) {
    return new Response(JSON.stringify({ message: 'Update failed' }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: 'User information updated' }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
