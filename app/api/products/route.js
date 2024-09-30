import clientPromise from "@/lib/db";

export async function GET(req, res) {
    try {
      const client = await clientPromise;
      const db = client.db('Shop'); // Ersetze 'retroshop' mit deinem Datenbanknamen
      const collection = db.collection('Products');
  
      const products = await collection.find({}).toArray(); // Leere Abfrage: liefert alle Produkte
  
      return new Response(JSON.stringify(products), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (e) {
      console.error(e);
      return new Response(JSON.stringify({ message: 'Failed to fetch products' }), {
        status: 500,
      });
    }
  }

