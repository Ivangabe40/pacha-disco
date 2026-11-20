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

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const payload = await req.json().catch(() => ({}));
    const fileUrl = String(payload.file_url || '').trim();
    if (!/^https?:\/\//i.test(fileUrl)) {
      return Response.json({ error: 'file_url inválida' }, { status: 400 });
    }

    const result = await base44.asServiceRole.integrations.Core.ExtractDataFromUploadedFile({
      file_url: fileUrl,
      json_schema: MENU_SCHEMA,
    });

    if (result?.status !== 'success') {
      return Response.json({ error: result?.details || 'No se pudo leer el archivo' }, { status: 422 });
    }

    const items = Array.isArray(result?.output?.items) ? result.output.items : [];
    return Response.json({ items });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}