import clientPromise from "@/lib/db";

export async function GET(req) {
  try {
    const query = new URL(req.url).searchParams.get('query');

    if (!query) {
      return new Response(JSON.stringify([]), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const client = await clientPromise;
    const db = client.db('Shop');
    const collection = db.collection('Products');

    const searchResults = await collection
      .find({ name: { $regex: query, $options: 'i' } }) // Case-insensitive search
      .toArray();

    return new Response(JSON.stringify(searchResults), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in search API:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch search results' }), {
      status: 500,
    });
  }
}
