import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

// KV Store endpoints
app.get('/make-server-a89f97b9/kv/:key', async (c) => {
  try {
    const key = c.req.param('key');
    const value = await kv.get(key);
    
    if (value === null) {
      return c.json({ error: 'Key not found' }, 404);
    }
    
    return c.json({ value });
  } catch (error) {
    console.log(`Error getting key: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

app.post('/make-server-a89f97b9/kv/:key', async (c) => {
  try {
    const key = c.req.param('key');
    const body = await c.req.json();
    await kv.set(key, body.value);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error setting key: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

app.delete('/make-server-a89f97b9/kv/:key', async (c) => {
  try {
    const key = c.req.param('key');
    await kv.del(key);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting key: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);
