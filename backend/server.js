require("dotenv").config();
const SibApiV3Sdk= require("sib-api-v3-sdk");
const crypto = require("crypto");
const express = require("express");
const pool = require("./config/db");
const QRCode = require("qrcode");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

const defaultClient = SibApiV3Sdk.ApiClient.instance;

defaultClient.authentications[
  "api-key"
].apiKey = process.env.BREVO_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

pool.query(`
  CREATE TABLE IF NOT EXISTS users (

    id SERIAL PRIMARY KEY,

    name TEXT,

    email TEXT UNIQUE,

    password TEXT,

    qr_code TEXT,

    coffee_count INTEGER DEFAULT 0,

    free_coffee INTEGER DEFAULT 0
  )
`)
.then(() => {

  console.log(
    "users table ready"
  );
  pool.query(`
  CREATE TABLE IF NOT EXISTS scan_logs (

    id SERIAL PRIMARY KEY,

    user_id INTEGER,

    reward_earned BOOLEAN DEFAULT false,

    created_at TIMESTAMP DEFAULT NOW()
  )
`)
.then(() => {

  console.log(
    "scan_logs table ready"
  );

})
.catch((err) => {

  console.log(err);

});

})
.catch((err) => {

  console.log(err);

});

/* =========================
   SCAN LOG TABLE
========================= */



/* =========================
   ROOT
========================= */

app.get("/", async (req, res) => {

  try {

    const result =
      await pool.query(
        "SELECT NOW()"
      );

    res.json(result.rows);

  } catch (error) {

    console.log(error);

    res.status(500).send(
      "Database error"
    );
  }
});

/* =========================
   RESET ALL
========================= */

app.get("/reset-all", async (req, res) => {

  try {

    await pool.query(
      "DELETE FROM scan_logs"
    );

    await pool.query(
      "DELETE FROM users"
    );

    res.json({
      success: true,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error:
        "Reset başarısız",
    });
  }
});

/* =========================
   GET USERS
========================= */

app.get("/users", async (req, res) => {

  try {

    const result =
      await pool.query(
        "SELECT * FROM users"
      );

    res.json(result.rows);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error:
        "Users alınamadı",
    });
  }
});

/* =========================
   GET USER BY ID
========================= */

app.get("/users/:id", async (req, res) => {

  try {

    const { id } =
      req.params;

    const result =
      await pool.query(
        "SELECT * FROM users WHERE id = $1",
        [id]
      );

    res.json(
      result.rows[0]
    );

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error:
        "Kullanıcı alınamadı",
    });
  }
});

/* =========================
   CREATE USER
========================= */

app.post("/users", async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      qr_code,
    } = req.body;

    const existingUser =
      await pool.query(
        `
        SELECT *
        FROM users

        WHERE email = $1
        `,
        [email]
      );

    if (
      existingUser.rows.length > 0
    ) {

      return res.status(400).json({
        error:
          "Bu email zaten kayıtlı",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const newUser =
      await pool.query(
        `
        INSERT INTO users
        (
          name,
          email,
          password,
          qr_code
        )

        VALUES ($1, $2, $3, $4)

        RETURNING
        id,
        name,
        email,
        qr_code,
        coffee_count,
        free_coffee
        `,
        [
          name,
          email,
          hashedPassword,
          qr_code,
        ]
      );

    const token =
      jwt.sign(
        {
          id:
            newUser.rows[0].id,
        },

        "SECRET_KEY",

        {
          expiresIn: "7d",
        }
      );

    res.json({

      token,

      user:
        newUser.rows[0],
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error:
        "Kayıt başarısız",
    });
  }
});
app.post("/login", async (req, res) => {

  try {

    const {
      email,
      password,
    } = req.body;

    const userResult =
      await pool.query(
        `
        SELECT *
        FROM users

        WHERE email = $1
        `,
        [email]
      );

    const user =
      userResult.rows[0];

    if (!user) {

      return res.status(400).json({
        error:
          "Email veya şifre yanlış",
      });
    }

    const validPassword =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!validPassword) {

      return res.status(400).json({
        error:
          "Email veya şifre yanlış",
      });
    }

    const token =
      jwt.sign(
        {
          id: user.id,
        },

        "SECRET_KEY",

        {
          expiresIn: "7d",
        }
      );

    res.json({

      token,

      user: {

        id: user.id,

        name: user.name,

        email: user.email,

        qr_code:
          user.qr_code,

        coffee_count:
          user.coffee_count,

        free_coffee:
          user.free_coffee,
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error:
        "Login başarısız",
    });
  }
});

/* =========================
   SCAN QR
========================= */

app.post("/scan", async (req, res) => {

  try {

    const { qr_code } =
      req.body;

    const userResult =
      await pool.query(
        `
        SELECT *
        FROM users

        WHERE qr_code = $1
        `,
        [qr_code]
      );

    const user =
      userResult.rows[0];

    if (!user) {

      return res.status(404).json({
        error:
          "Kullanıcı bulunamadı",
      });
    }

    let newCoffeeCount =
      user.coffee_count + 1;

    let newFreeCoffee =
      user.free_coffee;

    let rewardEarned =
      false;

    if (newCoffeeCount >= 10) {

      newCoffeeCount = 0;

      newFreeCoffee += 1;

      rewardEarned = true;
    }

    await pool.query(
      `
      UPDATE users

      SET
      coffee_count = $1,
      free_coffee = $2

      WHERE id = $3
      `,
      [
        newCoffeeCount,
        newFreeCoffee,
        user.id,
      ]
    );

    await pool.query(
      `
      INSERT INTO scan_logs
      (
        user_id,
        reward_earned
      )

      VALUES ($1, $2)
      `,
      [
        user.id,
        rewardEarned,
      ]
    );

    const fullUserResult =
      await pool.query(
        `
        SELECT *
        FROM users

        WHERE id = $1
        `,
        [user.id]
      );

    res.json(
      fullUserResult.rows[0]
    );

  } catch (error) {

    console.log(
      "SCAN ERROR:",
      error
    );

    res.status(500).json({
      error:
        "Scan başarısız",
    });
  }
});

/* =========================
   USE REWARD
========================= */

app.post("/use-reward", async (req, res) => {

  try {

    const { userId } =
      req.body;

    const userResult =
      await pool.query(
        `
        SELECT *
        FROM users

        WHERE id = $1
        `,
        [userId]
      );

    const user =
      userResult.rows[0];

    if (!user) {

      return res.status(404).json({
        error:
          "User not found",
      });
    }

    if (user.free_coffee <= 0) {

      return res.status(400).json({
        error:
          "No reward available",
      });
    }

    await pool.query(
      `
      UPDATE users

      SET free_coffee =
      free_coffee - 1

      WHERE id = $1
      `,
      [userId]
    );

    const fullUserResult =
      await pool.query(
        `
        SELECT *
        FROM users

        WHERE id = $1
        `,
        [userId]
      );

    res.json(
      fullUserResult.rows[0]
    );

  } catch (error) {

    console.log(
      "USE REWARD ERROR:",
      error
    );

    res.status(500).json({
      error:
        "Reward kullanılamadı",
    });
  }
});

/* =========================
   ANALYTICS
========================= */

app.get("/analytics", async (req, res) => {

  try {

    const todayCustomersResult =
  await pool.query(
    `
    SELECT COUNT(*)
    FROM users
    WHERE DATE(created_at) = CURRENT_DATE
    `
  );
    const scansResult =
      await pool.query(
        `SELECT COUNT(*)
        FROM scan_logs
        WHERE DATE(created_at) = CURRENT_DATE`
      );

    const rewardsResult =
      await pool.query(
        `
        SELECT COUNT(*)

        FROM scan_logs

        WHERE reward_earned = true

        AND DATE(created_at) = CURRENT_DATE
        `
      );

    const topCustomerResult =
      await pool.query(
        `
        SELECT
        name,
        coffee_count,
        free_coffee

        FROM users

        ORDER BY
        (
          coffee_count +
          free_coffee * 10
        ) DESC

        LIMIT 1
        `
      );

    res.json({

      users:
        Number(
          usersResult.rows[0].count
        ),

      scans:
        Number(
          scansResult.rows[0].count
        ),

      rewards:
        Number(
          rewardsResult.rows[0].count
        ),

      revenue:
        Number(
          scansResult.rows[0].count
        ) * 120,

      todayActivity: {

        scans:
          Number(
            scansResult.rows[0].count
          ),

        rewards:
          Number(
            rewardsResult.rows[0].count
          ),

        customers:
          Number(
            todayCustomersResult.rows[0].count
          ),
      },

      topCustomer:
        topCustomerResult.rows[0] ||
        null,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error:
        "Analytics alınamadı",
    });
  }
});

/* =========================
   QR GENERATOR
========================= */

app.get("/qr/:code", async (req, res) => {

  try {

    const { code } =
      req.params;

    const qrImage =
      await QRCode.toDataURL(code);

    const img =
      qrImage.replace(
        /^data:image\/png;base64,/,
        ""
      );

    const buffer =
      Buffer.from(
        img,
        "base64"
      );

    res.writeHead(200, {
      "Content-Type":
        "image/png",

      "Content-Length":
        buffer.length,
    });

    res.end(buffer);

  } catch (error) {

    console.log(error);

    res.status(500).send(
      "QR generation error"
    );
  }
});

app.post("/forgot-password", async (req, res) => {

  try {

    const { email } = req.body;

    const user =
      await pool.query(
        `
        SELECT *
        FROM users
        WHERE email = $1
        `,
        [email]
      );

    if (
      user.rows.length === 0
    ) {

      return res.status(404).json({
        error: "User not found",
      });
    }

    const token =
      crypto.randomBytes(32)
      .toString("hex");

    const expires =
      new Date(
        Date.now() +
        1000 * 60 * 30
      );

    await pool.query(
      `
      UPDATE users

      SET
      reset_token = $1,
      reset_token_expires = $2

      WHERE email = $3
      `,
      [
        token,
        expires,
        email,
      ]
    );

    await emailApi.sendTransacEmail({

      sender: {
        name: "Brekkie Club",
        email: "blcahmet.016@gmail.com",
      },

      to: [
        {
          email,
        },
      ],

      subject:
        "Brekkie Club Şifre Sıfırlama",

   htmlContent: `
  <h2>Brekkie Club</h2>

  <p>
    Şifre sıfırlama kodunuz:
  </p>

  <h1>${token}</h1>

  <p>
    Bu kod 30 dakika geçerlidir.
  </p>
`,
    });

    return res.json({
      success: true,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      error: "Server error",
    });
  }
});

app.get("/test-forgot", async (req, res) => {

  const response =
    await fetch(
      "https://brekkie-api.onrender.com/forgot-password",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          email:
            "kendi_mail_adresin",
        }),
      }
    );

  const result =
    await response.json();

  res.json(result);
});

app.get("/recent-scans", async (req, res) => {

  try {

    const result =
      await pool.query(`
        SELECT
          scan_logs.id,
          users.name,
          scan_logs.reward_earned,
          scan_logs.created_at

        FROM scan_logs

        JOIN users
        ON users.id = scan_logs.user_id

        ORDER BY scan_logs.id DESC

        LIMIT 3
      `);

    res.json(result.rows);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server error",
    });
  }
});

/* =========================
   SERVER
========================= */
pool.query(`
  ALTER TABLE users

  ADD COLUMN IF NOT EXISTS password TEXT
`)
.then(() => {

  console.log(
    "password column ready"
  );

})
.catch((err) => {

  console.log(err);

});

pool.query(`
  ALTER TABLE users
  ADD COLUMN IF NOT EXISTS reset_token TEXT
`)
.then(() => {

  console.log(
    "reset_token column ready"
  );

})
.catch((err) => {

  console.log(err);

});

pool.query(`
  ALTER TABLE users
  ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP
`)
.then(() => {

  console.log(
    "reset_token_expires column ready"
  );

})
.catch((err) => {

  console.log(err);

});
pool.query(`
  ALTER TABLE users

  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW()
`)
.then(() => {

  console.log(
    "created_at column ready"
  );

})
.catch((err) => {

  console.log(err);

});
app.post("/reset-password", async (req, res) => {

  try {

    const {
      token,
      password,
    } = req.body;

    const user =
      await pool.query(
        `
        SELECT *
        FROM users

        WHERE
        reset_token = $1

        AND
        reset_token_expires > NOW()
        `,
        [token]
      );

    if (
      user.rows.length === 0
    ) {

      return res.status(400).json({
        error:
          "Invalid or expired token",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    await pool.query(
      `
      UPDATE users

      SET
      password = $1,
      reset_token = NULL,
      reset_token_expires = NULL

      WHERE id = $2
      `,
      [
        hashedPassword,
        user.rows[0].id,
      ]
    );

    return res.json({
      success: true,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      error:
        "Server error",
    });
  }
});


app.listen(
  5000,
  "0.0.0.0",
  () => {

    console.log(
      "Server running on port 5000"
    );
  }
);