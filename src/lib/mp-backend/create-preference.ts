// ═══════════════════════════════════════════════════════════
// REFERENCIA — Backend Function: create-preference
// ═══════════════════════════════════════════════════════════
// Este archivo es de REFERENCIA. Para activarlo:
//   1. Upgrade a plan Builder+
// 2. Crear el archivo en: base44/functions/create-preference/entry.ts
//   3. Copiar este código tal cual
//   4. Deployar: npx base44 functions deploy create-preference
// ═══════════════════════════════════════════════════════════

import { createClientFromRequest } from "npm:@base44/sdk";

Deno.serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    const { event_id, quantity, buyer_email } = await req.json();

    // --- Validaciones de cantidad ---
    const qty = parseInt(quantity);
    if (!qty || qty < 1) {
      return Response.json({ error: "La cantidad debe ser al menos 1" }, { status: 400 });
    }

    const MAX_TICKETS = parseInt(Deno.env.get("MAX_TICKETS_PER_ORDER") || "10");
    if (qty > MAX_TICKETS) {
      return Response.json({ error: `Máximo ${MAX_TICKETS} entradas por compra` }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);

    // --- Fetch del evento desde DB (nunca confiar en precio del frontend) ---
    const event = await base44.asServiceRole.entities.Event.get(event_id);
    if (!event) {
      return Response.json({ error: "Evento no encontrado" }, { status: 404 });
    }

    if (event.status === "cancelado") {
      return Response.json({ error: "Este evento fue cancelado" }, { status: 400 });
    }

    const unitPrice = event.ticket_price;
    if (!unitPrice || unitPrice <= 0) {
      return Response.json({ error: "Este evento no tiene precio configurado" }, { status: 400 });
    }

    // --- Validar stock disponible ---
    const capacity = event.capacity || 0;
    const sold = event.tickets_sold || 0;
    const available = capacity > 0 ? capacity - sold : 999999;
    if (capacity > 0 && qty > available) {
      return Response.json(
        { error: `Solo quedan ${available} entradas disponibles` },
        { status: 400 }
      );
    }

    const total = Math.round(unitPrice * qty);
    const baseUrl = Deno.env.get("BASE_URL") || "";

    // --- Registrar la orden ANTES de redirigir a MP ---
    const order = await base44.asServiceRole.entities.TicketOrder.create({
      event_id: event_id,
      event_title: event.title,
      quantity: qty,
      unit_price: unitPrice,
      total: total,
      status: "pending",
      preference_id: "",
      payment_id: "",
      buyer_email: buyer_email || "",
    });

    // --- Crear preferencia de Mercado Pago Checkout Pro ---
    const preferenceData: Record<string, unknown> = {
      items: [
        {
          title: "Entrada anticipada discoteca",
          quantity: qty,
          unit_price: unitPrice,
          currency_id: "ARS",
        },
      ],
      back_urls: {
        success: `${baseUrl}/payment/success`,
        failure: `${baseUrl}/payment/failure`,
        pending: `${baseUrl}/payment/pending`,
      },
      auto_return: "approved",
      external_reference: order.id,
      statement_descriptor: "PACHA NIGHTCLUB",
    };

    if (buyer_email) {
      preferenceData.payer = { email: buyer_email };
    }

    const accessToken = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");
    if (!accessToken) {
      return Response.json(
        { error: "Credenciales de Mercado Pago no configuradas" },
        { status: 500 }
      );
    }

    const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preferenceData),
    });

    if (!mpResponse.ok) {
      const errorText = await mpResponse.text();
      console.error("MP error:", errorText);
      return Response.json(
        { error: "Error al crear preferencia de pago" },
        { status: 500 }
      );
    }

    const preference = await mpResponse.json();

    // --- Actualizar orden con preference_id ---
    await base44.asServiceRole.entities.TicketOrder.update(order.id, {
      preference_id: preference.id,
    });

    return Response.json({
      init_point: preference.init_point || preference.sandbox_init_point,
      order_id: order.id,
      preference_id: preference.id,
    });
  } catch (error) {
    console.error("create-preference error:", error);
    return Response.json({ error: error.message || "Error interno" }, { status: 500 });
  }
});