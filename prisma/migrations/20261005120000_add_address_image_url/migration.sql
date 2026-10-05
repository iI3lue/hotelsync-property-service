-- Columnas aplicadas previamente con db push directo en desarrollo local.
-- Esta migración solo alinea el historial (resolve --applied), no ejecuta cambios.
ALTER TABLE "hotels" ADD COLUMN IF NOT EXISTS "address" VARCHAR(255);

ALTER TABLE "room_types" ADD COLUMN IF NOT EXISTS "image_url" VARCHAR(500);
