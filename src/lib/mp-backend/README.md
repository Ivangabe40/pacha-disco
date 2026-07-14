# Mercado Pago Checkout Pro — Guía de Activación

## Variables de entorno (Secrets)

Cargar en **Dashboard → Secrets**:

```
MERCADOPAGO_ACCESS_TOKEN=tu_access_token_de_produccion
MERCADOPAGO_PUBLIC_KEY=tu_public_key_de_produccion
BASE_URL=https://tu-app.base44.app
MAX_TICKETS_PER_ORDER=10
```

Obtener credenciales en: https://www.mercadopago.com.ar/developers/panel/app

## Backend Functions

Los archivos de referencia están en:
- `src/lib/mp-backend/create-preference.txt`
- `src/lib/mp-backend/mercadopago-webhook.txt`

### Pasos para activar (requiere plan Builder+)

1. **Upgrade a Builder+**

2. **Crear los functions** copiando el código de referencia:
   ```
   base44/functions/create-preference/entry.ts
   base44/functions/mercadopago-webhook/entry.ts
   ```

3. **Deployar:**
   ```bash
   npx base44 functions deploy
   ```

4. **Configurar webhook en Mercado Pago:**
   - Ir a https://www.mercadopago.com.ar/developers/panel/app/webhooks
   - URL: `https://tu-app.base44.app/functions/mercadopago-webhook`
   - Activar el evento **"payment"**

5. **Para producción:** usar credenciales de producción (no las de test).

## Flujo de pago

1. Usuario entra a `/TicketSales` (botón "Entradas" en el nav)
2. Selecciona evento, cantidad y opcionalmente email
3. Click "Comprar con Mercado Pago"
4. Backend function `create-preference` valida cantidad, stock y precio (desde DB)
5. Se crea la orden en estado `pending` y la preferencia en MP
6. Usuario es redirigido al `init_point` de Mercado Pago
7. Usuario paga en MP (Checkout Pro)
8. MP redirige a `/payment/success`, `/payment/pending` o `/payment/failure`
9. MP envía webhook al function `mercadopago-webhook`
10. El webhook consulta el pago en MP, actualiza la orden y descuenta stock si fue aprobado

## Panel admin

En **Admin → Órdenes MP**:
- Ver listado de órdenes con filtro por estado
- Stats: entradas vendidas, recaudación total, stock restante
- Stock detallado por evento