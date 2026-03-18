/**
 * Migrates existing Service documents from old schema to new schema.
 * Run with: npx tsx scripts/migrate-services.ts
 *
 * Old schema: price, itinerary
 * New schema: priceAdult, priceKids, highlights, includes, excludes, goodToKnow
 */

import "dotenv/config";
import { MongoClient } from "mongodb";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

async function migrate() {
  const client = new MongoClient(url!);
  await client.connect();
  const db = client.db();
  const collection = db.collection("Service");

  const result = await collection.updateMany(
    { price: { $exists: true }, priceAdult: { $exists: false } },
    [
      { $set: { priceAdult: "$price", priceKids: 0 } },
      { $unset: ["price", "itinerary"] },
    ]
  );

  console.log(`Migrated ${result.modifiedCount} service(s) to new schema.`);
  await client.close();
  console.log("Done. Restart your dev server.");
}

migrate().catch((e) => {
  console.error("Migration failed:", e);
  process.exit(1);
});
