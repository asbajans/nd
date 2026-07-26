-- Mevcut veritabanina yeni kolonlari eklemek icin
-- Portainer > Stacks > nd > db container > Console (exec) > calistirin:
-- PGPASSWORD=SIFREN psql -U nakliyat_user -d nakliyat_diyari -f /database/migrate-existing.sql

ALTER TABLE "listings" ADD COLUMN IF NOT EXISTS "vehicleTypes" TEXT NOT NULL DEFAULT '';
ALTER TABLE "listings" ADD COLUMN IF NOT EXISTS "fromLat" TEXT;
ALTER TABLE "listings" ADD COLUMN IF NOT EXISTS "fromLng" TEXT;
ALTER TABLE "listings" ADD COLUMN IF NOT EXISTS "toLat" TEXT;
ALTER TABLE "listings" ADD COLUMN IF NOT EXISTS "toLng" TEXT;
ALTER TABLE "listings" ADD COLUMN IF NOT EXISTS "truckType" TEXT;

-- Mevcut ilanlari guncelle
UPDATE "listings" SET "vehicleTypes" = "vehicleType" WHERE "vehicleType" IS NOT NULL AND "vehicleTypes" = '';
