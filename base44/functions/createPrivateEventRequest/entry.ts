import { createClientFromRequest } from 'npm:@base44/sdk@0.8.63';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const PHONE_RE = /^[0-9+\s()-]{6,30}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;

// Limitación antispam en memoria por instancia del worker (mejor esfuerzo).
const recentByKey = new Map();

function text(value, max) {
  return String(value ?? '').trim().slice(0, max);
}

export default async function (req) {
  try {
    if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 });

    const payload = await req.json().catch(() => ({}));

    // Honeypot: un humano no completa este campo.
    if (text(payload.company, 100)) return Response.json({ ok: true });

    const name = text(payload.name, 80);
    const email = text(payload.email, 120).toLowerCase();
    const phone = text(payload.phone, 30);
    const eventType = text(payload.event_type, 80);
    const date = text(payload.date, 10);
    const message = text(payload.message, 2000);
    const guestsRaw = Number(payload.guests);
    const guests = Number.isFinite(guestsRaw) ? Math.round(guestsRaw) : null;

    if (name.length < 2) return Response.json({ error: 'Ingresá tu nombre' }, { status: 400 });
    if (!EMAIL_RE.test(email)) return Response.json({ error: 'Ingresá un email válido' }, { status: 400 });
    if (phone && !PHONE_RE.test(phone)) return Response.json({ error: 'Ingresá un teléfono válido' }, { status: 400 });
    if (date && !DATE_RE.test(date)) return Response.json({ error: 'Ingresá una fecha válida' }, { status: 400 });
    if (guests !== null && (guests < 1 || guests > 2000)) {
      return Response.json({ error: 'La cantidad de invitados no es válida' }, { status: 400 });
    }

    const key = `${email}|${date}`;
    const last = recentByKey.get(key) || 0;
    if (Date.now() - last < DUPLICATE_WINDOW_MS) {
      // Ya recibida hace instantes: no se duplica el registro.
      return Response.json({ ok: true, message: 'Recibimos tu solicitud. El equipo de Pachá se va a contactar con vos.' });
    }
    recentByKey.set(key, Date.now());

    const base44 = createClientFromRequest(req);

    // Campos permitidos únicamente; el estado siempre lo fija el servidor.
    await base44.asServiceRole.entities.PrivateEventRequest.create({
      name,
      email,
      phone: phone || undefined,
      event_type: eventType || undefined,
      date: date || undefined,
      guests: guests ?? undefined,
      message: message || undefined,
      status: 'pendiente',
    });

    return Response.json({
      ok: true,
      message: 'Recibimos tu solicitud. El equipo de Pachá se va a contactar con vos.',
    });
  } catch (error) {
    return Response.json({ error: 'No se pudo registrar la solicitud' }, { status: 500 });
  }
}