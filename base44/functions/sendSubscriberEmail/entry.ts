import { createClientFromRequest } from 'npm:@base44/sdk@0.8.63';

const BATCH_SIZE = 6;
const MAX_SUBJECT = 200;
const MAX_MESSAGE = 8000;
const MAX_RECIPIENTS = 1000;
const MIN_INTERVAL_MS = 60 * 1000;

// Limitación de frecuencia en memoria por instancia del worker (mejor esfuerzo).
const lastSendByUser = new Map();

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default async function (req) {
  try {
    if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 });

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const payload = await req.json().catch(() => ({}));
    if (payload.confirm !== true) {
      return Response.json({ error: 'Falta la confirmación explícita del envío' }, { status: 400 });
    }

    const subject = String(payload.subject || '').trim().replace(/[\r\n]+/g, ' ').slice(0, MAX_SUBJECT);
    const message = String(payload.body || '').trim().slice(0, MAX_MESSAGE);
    const personalized = payload.personalized === true;

    if (!subject || !message) {
      return Response.json({ error: 'Asunto y mensaje son obligatorios' }, { status: 400 });
    }

    const last = lastSendByUser.get(user.id) || 0;
    if (Date.now() - last < MIN_INTERVAL_MS) {
      return Response.json({ error: 'Esperá un minuto antes de hacer otro envío masivo' }, { status: 429 });
    }

    // Los destinatarios salen siempre del listado del servidor: nunca del navegador.
    const rows = await base44.asServiceRole.entities.NewsletterSubscriber.filter({ is_active: true });
    const subscribers = (Array.isArray(rows) ? rows : rows?.items || []).filter((s) => s.email);
    if (subscribers.length > MAX_RECIPIENTS) {
      return Response.json({ error: 'Demasiados destinatarios para un solo envío' }, { status: 400 });
    }

    lastSendByUser.set(user.id, Date.now());

    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');
    let sent = 0;
    let failed = 0;

    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
      const batch = subscribers.slice(i, i + BATCH_SIZE);
      const results = await Promise.allSettled(
        batch.map((sub) => {
          const greeting = personalized && sub.name ? `Hola ${escapeHtml(sub.name)}!<br><br>` : '';
          const signature = personalized ? '<br><br>---<br>Pachá Night Club' : '';
          return base44.asServiceRole.integrations.Core.SendEmail({
            to: sub.email,
            from_name: 'Pachá Night Club',
            subject,
            body: `${greeting}${safeMessage}${signature}`,
          });
        })
      );
      results.forEach((r) => { if (r.status === 'fulfilled') sent += 1; else failed += 1; });
    }

    // Solo resultados agregados: nunca se devuelven direcciones de terceros.
    return Response.json({ success: true, sent, failed, total: subscribers.length });
  } catch (error) {
    return Response.json({ error: 'No se pudo completar el envío' }, { status: 500 });
  }
}