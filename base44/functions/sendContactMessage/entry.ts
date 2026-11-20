import { createClientFromRequest } from 'npm:@base44/sdk@0.8.63';

const RECIPIENT = 'contacto@pachadisco.com.ar';

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json().catch(() => ({}));

    const name = String(payload.name || '').trim().replace(/[\r\n]+/g, ' ').slice(0, 120);
    const email = String(payload.email || '').trim().slice(0, 160);
    const message = String(payload.message || '').trim().slice(0, 4000);

    if (!name || !email || !message) {
      return Response.json({ error: 'Faltan datos de contacto' }, { status: 400 });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return Response.json({ error: 'Email inválido' }, { status: 400 });
    }

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: RECIPIENT,
      from_name: 'Pachá Night Club',
      subject: `Consulta web - ${name}`,
      body: `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}