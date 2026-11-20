import { createClientFromRequest } from 'npm:@base44/sdk@0.8.63';

const BATCH_SIZE = 6;

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const payload = await req.json().catch(() => ({}));
    const subject = String(payload.subject || '').trim().replace(/[\r\n]+/g, ' ').slice(0, 200);
    const message = String(payload.body || '').trim().slice(0, 8000);
    const personalized = payload.personalized === true;

    if (!subject || !message) {
      return Response.json({ error: 'Asunto y mensaje son obligatorios' }, { status: 400 });
    }

    const rows = await base44.asServiceRole.entities.NewsletterSubscriber.filter({ is_active: true });
    const subscribers = (Array.isArray(rows) ? rows : rows?.items || []).filter((s) => s.email);

    let sent = 0;
    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
      const batch = subscribers.slice(i, i + BATCH_SIZE);
      const results = await Promise.allSettled(
        batch.map((sub) => {
          const greeting = personalized && sub.name ? `Hola ${sub.name}!<br><br>` : '';
          const signature = personalized ? '<br><br>---<br>Pachá Night Club' : '';
          return base44.asServiceRole.integrations.Core.SendEmail({
            to: sub.email,
            from_name: 'Pachá Night Club',
            subject,
            body: `${greeting}${message.replace(/\n/g, '<br>')}${signature}`,
          });
        })
      );
      sent += results.filter((r) => r.status === 'fulfilled').length;
    }

    return Response.json({ success: true, sent, total: subscribers.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}