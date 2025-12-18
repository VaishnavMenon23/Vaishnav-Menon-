import { CosmosClient } from '@azure/cosmos';

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const dbName = process.env.COSMOS_DB || 'portfolio';

let client: CosmosClient | null = null;
export function getClient() {
  if (!client) {
    if (!endpoint || !key) throw new Error('Cosmos config missing');
    client = new CosmosClient({ endpoint, key });
  }
  return client;
}

export async function getDb() {
  const c = getClient();
  const { database } = await c.databases.createIfNotExists({ id: dbName });
  return database;
}
