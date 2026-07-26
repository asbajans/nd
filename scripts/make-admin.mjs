// scripts/make-admin.mjs
import pkg from 'pg';
const { Pool } = pkg;

const email = process.argv[2];
if (!email) {
  console.error("Kullanim: node scripts/make-admin.mjs <email>");
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

try {
  const { rowCount } = await pool.query(
    `UPDATE "user" SET role = 'admin', approved = true WHERE email = $1`,
    [email]
  );

  if (rowCount === 0) {
    console.error(`Hata: "${email}" eposta adresli kullanici bulunamadi.`);
    console.error("Once https://nakliyatdiyari.com/sign-up adresinden kaydolun.");
    process.exit(1);
  }

  console.log(`✔ "${email}" basariyla admin yapildi.`);
  console.log("Simdi https://nakliyatdiyari.com/admin adresinden panele erisebilirsiniz.");
} finally {
  await pool.end();
}
