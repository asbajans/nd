-- Kullaniciyi admin yapmak icin PostgreSQL'de calistirin:
-- psql $DATABASE_URL -f scripts/make-admin.sql
-- Degiskenleri kendi bilgilerinizle guncelleyin

UPDATE "user"
SET role = 'admin', approved = true
WHERE email = 'admin@nakliyatdiyari.com';
