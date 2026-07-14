require("dotenv").config();

const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function seedAdmin() {
  try {
    const existing = await pool.query(
      "SELECT id FROM staff_accounts WHERE LOWER(username)=LOWER($1)",
      ["admin"]
    );

    if (existing.rows.length > 0) {
      console.log("✅ Admin zaten mevcut.");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("123456", 10);

    await pool.query(
      `
      INSERT INTO staff_accounts
      (
        name,
        username,
        password,
        role,
        active
      )
      VALUES ($1,$2,$3,$4,$5)
      `,
      [
        "Admin",
        "admin",
        hashedPassword,
        "admin",
        true,
      ]
    );

    console.log("🎉 Admin hesabı oluşturuldu.");
    console.log("Kullanıcı Adı: admin");
    console.log("Şifre: 123456");

    process.exit();

  } catch (err) {

    console.log(err);

    process.exit(1);

  }
}

seedAdmin();