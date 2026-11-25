import { put } from '@vercel/blob';
import { timingSafeEqual } from 'node:crypto';

const eq = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && timingSafeEqual(x, y); };
const raw = async (r) => { const c = []; for await (const d of r) c.push(d); return Buffer.concat(c); };
const out = (res, s, o) => res.status(s).json(o);

// Admin only: ?a=login | save | upload. Login is checked here on the server using ADMIN_USER / ADMIN_PASS.
export default async function handler(req, res) {
  if (req.method !== 'POST') return out(res, 405, { error: 'POST only' });
  const U = process.env.ADMIN_USER, P = process.env.ADMIN_PASS;
  if (!U || !P) return out(res, 500, { error: 'Set ADMIN_USER and ADMIN_PASS in Vercel settings, then redeploy.' });
  const t = Buffer.from((req.headers.authorization || '').replace(/^Basic /, ''), 'base64').toString();
  const i = t.indexOf(':');
  const ok = i > -1 && (eq(t.slice(0, i).toLowerCase(), U.toLowerCase()) & eq(t.slice(i + 1), P));
  if (!ok) { await new Promise((r) => setTimeout(r, 1000)); return out(res, 401, { error: 'Unauthorized' }); }
  const a = new URL(req.url, 'http://x').searchParams.get('a');
  try {
    if (a === 'login') return out(res, 200, { ok: 1 });
    const body = await raw(req);
    if (a === 'save') {
      const d = JSON.parse(body.toString());
      if (!Array.isArray(d) || d.length < 1 || d.length > 200) throw new Error('Bad product data');
      await put('products.json', JSON.stringify(d), { access: 'public', allowOverwrite: true, addRandomSuffix: false, contentType: 'application/json', cacheControlMaxAge: 60 });
      return out(res, 200, { ok: 1 });
    }
    if (a === 'upload') {
      if (!body.length || body.length > 4e6) throw new Error('Image is empty or too large');
      const b = await put('photos/photo.jpg', body, { access: 'public', addRandomSuffix: true, contentType: 'image/jpeg' });
      return out(res, 200, { url: b.url });
    }
    return out(res, 400, { error: 'Unknown action' });
  } catch (e) {
    return out(res, 500, { error: e.message || 'Server error' });
  }
}
