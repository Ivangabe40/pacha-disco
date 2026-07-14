// ═══════════════════════════════════════════════════════════
// REFERENCIA — Backend Function: mercadopago-webhook
// ═══════════════════════════════════════════════════════════
// Este archivo es de REFERENCIA. Para activarlo:
//   1. Upgrade a plan Builder+
//   2. Crear el archivo en: base44/functions/mercadopago-webhook/entry.ts
//   3. Copiar este código tal cual
//   4. Deployar: npx base44 functions deploy mercadopago-webhook
//   5. Configurar la URL en MP Developers → Webhooks
// ═══════════════════════════════════════════════════════════

import { createClientFromRequest } from "npm:@base44/sdk";

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  try {
    let paymentId: string | null = null;

    // --- Soportar IPN (GET) y Webhook (POST) ---
    if (req.method === "GET") {
      const url = new URL(req.url);
      const topic = url.searchParams.get("topic");
      const id = url.searchParams.get("id");
      if (topic === "payment" && id) {
        paymentId = id;
      }
    } else if (req.method === "POST") {
      const body = await req.json();
      // Formato nuevo: { type: "payment", data: { id: "123" } }
      // Formato acción:  { action: "payment.updated", data: { id: "123" } }
      if (body.type === "payment" || (body.action && String(body.action).startsWith("payment"))) {
        paymentId = body.data?.id ? String(body.data.id) : null;
      }
    }

    // Siempre responder 200/201 a Mercado Pago
    if (!paymentId) {
      return Response.json({ status: "ok", message: "Not a payment notification" }, { status: 200 });
    }

    // --- Consultar el pago en Mercado Pago ---
    const accessToken = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");
    if (!accessToken) {
      return Response.json({ status: "ok" }, { status: 200 });
    }

    const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!paymentResponse.ok) {
      return Response.json({ status: "ok" }, { status: 200 });
    }

    const payment = await paymentResponse.json();
    const preferenceId = payment.preference_id;
    const externalRef = payment.external_reference;
    const mpStatus = payment.status; // approved, rejected, pending, in_process, cancelled...

    // --- Buscar la orden por external_reference (order ID) o preference_id ---
    let order = null;
    if (externalRef) {
      try {
        order = await base44.asServiceRole.entities.TicketOrder.get(externalRef);
      } catch {
        order = null;
      }
    }
    if (!order && preferenceId) {
      const orders = await base44.asServiceRole.entities.TicketOrder.filter({ preference_id: preferenceId });
      if (orders.length > 0) order = orders[0];
    }

    if (!order) {
      return Response.json({ status: "ok", message: "Order not found" }, { status: 200 });
    }

    // --- Mapear estado de MP a estado interno ---
    let orderStatus = "pending";
    if (mpStatus === "approved") orderStatus = "approved";
    else if (mpStatus === "rejected" || mpStatus === "cancelled") orderStatus = "rejected";

    // --- Actualizar solo si el estado cambió ---
    if (order.status !== orderStatus) {
      await base44.asServiceRole.entities.TicketOrder.update(order.id, {
        status: orderStatus,
        payment_id: String(paymentId),
        buyer_email: order.buyer_email || payment.payer?.email || "",
      });

      // --- Descontar stock solo cuando el pago pasa a aprobado ---
      if (orderStatus === "approved") {
        const event = await base44.asServiceRole.entities.Event.get(order.event_id);
        if (event) {
          const currentSold = event.tickets_sold || 0;
          await base44.asServiceRole.entities.Event.update(order.event_id, {
            tickets_sold: currentSold + order.quantity,
          });
        }
      }
    }

    return Response.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("webhook error:", error);
    // Siempre 200 para que MP no reintente innecesariamente
    return Response.json({ status: "ok", error: error.message }, { status: 200 });
  }
});