import { list } from '@vercel/blob';

// Public: returns the saved product list (empty list = site uses the products inside index.html)
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const { blobs } = await list({ prefix: 'products.json', limit: 1, access: 'public' });
    if (!blobs.length) return res.status(200).json([]);
    const r = await fetch(blobs[0].url + '?t=' + Date.now(), { cache: 'no-store' });
    return res.status(200).json(await r.json());
  } catch (e) {
    return res.status(200).json([]);
  }
}
