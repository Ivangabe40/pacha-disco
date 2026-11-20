# PACHA DISCO — BACKUP CONGELADO

Fecha de referencia: 2026-11-20 UTC. Aplicación Base44: `69ad4033370fdc9f9fe8b117`.

Repositorio privado: https://github.com/Ivangabe40/pacha-disco
Rama del snapshot: `backup/frozen-2026-11-20`.
Main verificado en Base44/GitHub: `291193b0c6c87299b511f6ebe647d9ea39c5a962`.

## Qué contiene esta carpeta
- `manifest.json`: identificadores, revisiones, conteos, diferencias entre ramas y límites conocidos.
- `schemas/entities.json`: 12 esquemas de entidades con reglas RLS.
- `data/*.json`: exportación completa de registros consultados por entidad.
- `config/pacha_assistant.jsonc` y `config/atencion-al-publico.md`: agente Pachi y skill asociada.
- `backend-functions/extractMenuItems/main.ts`: función backend desplegada.

## Código fuente
El commit principal de GitHub coincide con la revisión Base44 indicada arriba. El código de main está en la raíz del repositorio y puede recuperarse con:

```bash
git clone https://github.com/Ivangabe40/pacha-disco.git
cd pacha-disco
git checkout 291193b0c6c87299b511f6ebe647d9ea39c5a962
```

La otra rama de Base44, `modernizacion-builder-nov2026`, se conserva separada como rama GitHub `b44/6aff92cb18213f06c6a4db64`. No fusionar sin comparar: ambas ramas tienen archivos exclusivos. Su inventario de diferencias figura en `manifest.json`.

## Restauración
1. Clonar el commit indicado de main.
2. Crear/seleccionar una app Base44 y reproducir los esquemas de `schemas/entities.json`.
3. Importar los JSON de `data/` en sus entidades; revisar duplicados antes de importar si se restaura sobre una app existente.
4. Volver a desplegar la función backend desde `backend-functions/`.
5. Restaurar configuración del agente Pachi desde `config/` y verificar herramientas/lectura anónima.
6. Reconfigurar las variables de entorno y secretos manualmente; no se exportan credenciales.
7. Volver a autorizar conectores externos (WhatsApp/OAuth) desde sus proveedores.
8. Reasociar los assets binarios desde la biblioteca Base44 o los URLs que aparecen en registros y código.
9. Ejecutar `npm install`, `npm run build` y pruebas de autenticación, RLS, chat y páginas.

## Límites de este backup
- No contiene claves, tokens, passwords, credenciales ni secretos.
- Los binarios de Assets y el listado completo de checkpoints fueron devueltos truncados por el endpoint de Base44; no se presentan como descargados en esta copia. La aplicación original y su biblioteca de Assets permanecen en Base44.
- Los registros de User y NewsletterSubscriber contienen datos personales. Esta rama pertenece a un repositorio privado: no cambiar su visibilidad ni compartirla públicamente.
- Este snapshot no desactiva ni modifica la app Base44; es una copia en paralelo.
