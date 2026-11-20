import { createClientFromRequest } from 'npm:@base44/sdk@0.8.63';

const MENU_SCHEMA = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          category: { type: 'string' },
        },
      },
    },
  },
};

const ALLOWED_HOSTS = ['media.base44.com', 'base44.com', 'base44.app', 'pachadisco.com.ar'];
const ALLOWED_FILE = /\.(pdf|png|jpe?g|webp|csv|xlsx|json)$/i;

// Solo archivos alojados en el storage de la plataforma o el dominio oficial.
function isTrustedFileUrl(value) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    return false;
  }
  if (parsed.protocol !== 'https:') return false;
  const host = parsed.hostname.toLowerCase();
  const trustedHost = ALLOWED_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
  return trustedHost && ALLOWED_FILE.test(parsed.pathname);
}

export default async function (req) {
  try {
    if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 });

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const payload = await req.json().catch(() => ({}));
    const fileUrl = String(payload.file_url || '').trim();
    if (!isTrustedFileUrl(fileUrl)) {
      return Response.json({ error: 'El archivo debe estar subido al storage de la app' }, { status: 400 });
    }

    const result = await base44.asServiceRole.integrations.Core.ExtractDataFromUploadedFile({
      file_url: fileUrl,
      json_schema: MENU_SCHEMA,
    });

    if (result?.status !== 'success') {
      return Response.json({ error: result?.details || 'No se pudo leer el archivo' }, { status: 422 });
    }

    // Devuelve los productos para revisión: nunca los guarda automáticamente.
    const items = Array.isArray(result?.output?.items) ? result.output.items : [];
    return Response.json({ items });
  } catch (error) {
    return Response.json({ error: 'No se pudo procesar el archivo' }, { status: 500 });
  }
}