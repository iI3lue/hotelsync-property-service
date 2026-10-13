-- Foto de portada del hotel (migración en línea: IF NOT EXISTS no toca datos).
ALTER TABLE "hotels" ADD COLUMN IF NOT EXISTS "image_url" VARCHAR(500);
