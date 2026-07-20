
require("dotenv").config();
const { Expo } = require("expo-server-sdk");
const {
  createAuditLog,
} = require("./services/auditService");
const {
  sendNotification,
  sendToMany,
} = require("./services/notificationService");
const expo = new Expo();
const SibApiV3Sdk= require("sib-api-v3-sdk");
const crypto = require("crypto");
const express = require("express");
const pool = require("./config/db");
const QRCode = require("qrcode");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3000",
    ],
    credentials: true,
  })
);
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
app.post("/customer-by-qr", async (req, res) => {

  try {

    const { qr_code } = req.body;

    const result = await pool.query(
      `
      SELECT *
      FROM users
      WHERE qr_code = $1
      `,
      [qr_code]
    );

    if (result.rows.length === 0) {

      return res.status(404).json({
        error: "Kullanıcı bulunamadı",
      });

    }

    res.json({
      success: true,
      user: result.rows[0],
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Kullanıcı getirilemedi",
    });

  }

});
app.post("/scan", async (req, res) => {

  try {

 const {
  userId,
  staffId,
  staffName,
} = req.body;

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
          "Kullanıcı bulunamadı",
      });
    }

    let newCoffeeCount =
      user.coffee_count + 1;

    let newFreeCoffee =
      user.free_coffee;
const settingsResult =
  await pool.query(
    `
    SELECT loyalty_target
    FROM settings
    LIMIT 1
    `
  );

const loyaltyTarget =
  settingsResult.rows[0].loyalty_target;
    let rewardEarned =
      false;

    if (newCoffeeCount >= loyaltyTarget) {

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

   res.json({
  success: true,
  user: fullUserResult.rows[0],
});
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

    res.json({
  success: true,
  user: fullUserResult.rows[0],
});

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
   const salesResult =
await pool.query(`
SELECT COUNT(*)
FROM sales
WHERE DATE(created_at)=CURRENT_DATE
`);
const revenueResult =
await pool.query(`
SELECT
COALESCE(SUM(total_price),0) AS revenue
FROM sales
WHERE DATE(created_at)=CURRENT_DATE
`);

    const rewardsResult =
      await pool.query(
        `
        SELECT COUNT(*)

        FROM scan_logs

        WHERE reward_earned = true

        AND DATE(created_at) = CURRENT_DATE
        `
      );
      const usersResult =
  await pool.query(
    `
    SELECT COUNT(*)
    FROM users
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

     sales:
Number(salesResult.rows[0].count),

      rewards:
        Number(
          rewardsResult.rows[0].count
        ),

      revenue:
Number(revenueResult.rows[0].revenue),

     todayActivity:{
    sales:
      Number(
        salesResult.rows[0].count
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

    const token = Math.floor(
  100000 + Math.random() * 900000
).toString();

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
pool.query(`
  ALTER TABLE users

  ADD COLUMN IF NOT EXISTS push_token TEXT
`)
.then(() => {

  console.log(
    "push_token column ready"
  );

})
.catch((err) => {

  console.log(err);

});
pool.query(`
  CREATE TABLE IF NOT EXISTS campaigns (

    id SERIAL PRIMARY KEY,

    title TEXT NOT NULL,

    description TEXT,

    campaign_type TEXT NOT NULL,

    reward_type TEXT NOT NULL,

    reward_value INTEGER DEFAULT 0,

    trigger_value INTEGER DEFAULT 0,

    is_active BOOLEAN DEFAULT true,

    created_at TIMESTAMP DEFAULT NOW()

  )
`)
.then(() => {

  console.log("campaigns table ready");

})
.catch((err) => {

  console.log(err);

});
pool.query(`
CREATE TABLE IF NOT EXISTS stores (

id SERIAL PRIMARY KEY,

name TEXT NOT NULL,

address TEXT,

latitude DOUBLE PRECISION NOT NULL,

longitude DOUBLE PRECISION NOT NULL,

radius INTEGER DEFAULT 250,

is_active BOOLEAN DEFAULT TRUE,

created_at TIMESTAMP DEFAULT NOW()

)
`)
.then(()=>{

console.log("stores table ready");

})
.catch(console.log);
pool.query(`
INSERT INTO stores
(
name,
address,
latitude,
longitude,
radius
)

SELECT
'Brekkie Moda',
'Kadıköy / İstanbul',
40.98621240712826,
29.033098618225903,
250

WHERE NOT EXISTS (

SELECT 1
FROM stores

)
`)
.catch(console.log);
pool.query(`
UPDATE stores
SET
  name = 'Brekkie Moda',
  address = 'Kadıköy / İstanbul',
  latitude = 40.98621240712826,
  longitude = 29.033098618225903
WHERE id = 1
`)
.then(() => {

  console.log("Store updated");

})
.catch(console.log);
app.get("/stores", async (req,res)=>{

try{

const result=await pool.query(
`
SELECT *
FROM stores
WHERE is_active=true
ORDER BY id
`
);

res.json({
success:true,
stores:result.rows
});

}catch(err){

console.log(err);

res.status(500).json({
error:"Stores alınamadı"
});

}

});
pool.query(`
CREATE TABLE IF NOT EXISTS staff_accounts (

id SERIAL PRIMARY KEY,

name TEXT NOT NULL,

username TEXT UNIQUE NOT NULL,

password TEXT NOT NULL,

role TEXT NOT NULL DEFAULT 'cashier',

active BOOLEAN DEFAULT TRUE,

created_at TIMESTAMP DEFAULT NOW()

)
`)
.then(()=>{

console.log("staff_accounts table ready");

})
.catch(console.log);
pool.query(`
INSERT INTO staff_accounts
(name, username, password, role)

SELECT
'Admin',
'admin',
'1234',
'admin'

WHERE NOT EXISTS (

SELECT 1
FROM staff_accounts
WHERE username='admin'

)
`)
.catch(console.log);
pool.query(`
INSERT INTO staff_accounts
(name, username, password, role)

SELECT
'Kasiyer',
'cashier',
'1234',
'cashier'

WHERE NOT EXISTS (

SELECT 1
FROM staff_accounts
WHERE username='cashier'

)
`)
.catch(console.log);
pool.query(`
CREATE TABLE IF NOT EXISTS settings (

id SERIAL PRIMARY KEY,

business_name TEXT DEFAULT 'Brekkie',

loyalty_target INTEGER DEFAULT 10,

reward_type TEXT DEFAULT 'free_coffee',

cashier_username TEXT DEFAULT 'Cashier',

cashier_password TEXT DEFAULT '1234',

admin_username TEXT DEFAULT 'Admin',

admin_password TEXT DEFAULT '1234',

updated_at TIMESTAMP DEFAULT NOW()

)
`)
.then(()=>{

console.log("settings table ready");

})
.catch(console.log);

pool.query(`
INSERT INTO settings
(id)

SELECT 1

WHERE NOT EXISTS (

SELECT 1 FROM settings

)
`)
.catch(console.log);
pool.query(`
CREATE TABLE IF NOT EXISTS audit_logs (

id SERIAL PRIMARY KEY,

user_role TEXT NOT NULL,

action TEXT NOT NULL,

description TEXT NOT NULL,

created_at TIMESTAMP DEFAULT NOW()

)
`)
.then(()=>{

console.log("audit_logs table ready");

})
.catch(console.log);
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
app.post("/users/push-token", async (req, res) => {

  try {

    const {
      userId,
      pushToken,
    } = req.body;

    await pool.query(
      `
      UPDATE users

      SET push_token = $1

      WHERE id = $2
      `,
      [
        pushToken,
        userId,
      ]
    );

    res.json({
      success: true,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error:
        "Push token kaydedilemedi",
    });

  }

});
app.post("/notifications/test", async (req, res) => {

  try {

    const { userId } = req.body;

    const result = await pool.query(
      `
      SELECT push_token
      FROM users
      WHERE id = $1
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Kullanıcı bulunamadı",
      });
    }

    const pushToken = result.rows[0].push_token;

    if (!Expo.isExpoPushToken(pushToken)) {
      return res.status(400).json({
        error: "Geçersiz Push Token",
      });
    }
await sendNotification(
  pushToken,
  "☕ Brekkie",
  "Tebrikler! İlk Push Notification başarıyla çalıştı. 🎉",
  {
    screen: "home",
  }
);
    res.json({
      success: true,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Bildirim gönderilemedi",
    });

  }

});
app.post("/notifications/send-all", async (req, res) => {

  try {

    const { title, body } = req.body;

    const result = await pool.query(`
      SELECT push_token
      FROM users
      WHERE push_token IS NOT NULL
    `);

    await sendToMany(
  result.rows.map(
    row => row.push_token
  ),
  title,
  body
);
await createAuditLog(
  "admin",
  "notification_send",
  `${title} bildirimi gönderildi`
);
    res.json({
      success: true,
      sent: messages.length,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Bildirim gönderilemedi",
    });

  }

});

  app.get("/campaigns", async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT *
      FROM campaigns
      ORDER BY created_at DESC
    `);

    res.json(result.rows);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Campaigns alınamadı",
    });

  }

});
app.get("/staff", async (req,res)=>{

try{

const result=await pool.query(
`
SELECT
  id,
  name,
  username,
  role,
  active,
  created_at
FROM staff_accounts
ORDER BY id
`
);

res.json(result.rows);

}catch(err){

console.log(err);

res.status(500).json({

error:"Personeller alınamadı"

});

}

});
app.post("/staff", async (req, res) => {

  try {

    const {
      name,
      username,
      password,
      role,
    } = req.body;

    const existing = await pool.query(
      `
      SELECT id
FROM staff_accounts
WHERE LOWER(username) = LOWER($1)
      `,
      [username]
    );

    if (existing.rows.length > 0) {

      return res.status(400).json({
        error: "Bu kullanıcı adı zaten kullanılıyor",
      });

    }
const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `
      INSERT INTO staff_accounts
      (
        name,
        username,
        password,
        role
      )

      VALUES ($1,$2,$3,$4)

      RETURNING *
      `,
      [
        name,
        username,
        hashedPassword,
        role,
      ]
    );

    await createAuditLog(
      "admin",
      "staff_create",
      `${name} personeli oluşturuldu`
    );

    res.json(result.rows[0]);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Personel oluşturulamadı",
    });

  }

});
app.post("/campaigns", async (req, res) => {

  try {

    const {
      title,
      description,
      campaign_type,
      reward_type,
      reward_value,
      trigger_value,
    } = req.body;

    const result =
      await pool.query(
        `
        INSERT INTO campaigns
        (
          title,
          description,
          campaign_type,
          reward_type,
          reward_value,
          trigger_value
        )

        VALUES
        ($1,$2,$3,$4,$5,$6)

        RETURNING *
        `,
        [
          title,
          description,
          campaign_type,
          reward_type,
          reward_value,
          trigger_value,
        ]
      );

    await createAuditLog(
  "admin",
  "campaign_create",
  `${title} kampanyası oluşturuldu`
);

res.json(result.rows[0]);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Campaign oluşturulamadı",
    });

  }

});
app.put("/campaigns/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      campaign_type,
      reward_type,
      reward_value,
      trigger_value,
      is_active,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE campaigns
      SET
        title = $1,
        description = $2,
        campaign_type = $3,
        reward_type = $4,
        reward_value = $5,
        trigger_value = $6,
        is_active = $7
      WHERE id = $8
      RETURNING *;
      `,
      [
        title,
        description,
        campaign_type,
        reward_type,
        reward_value,
        trigger_value,
        is_active,
        id,
      ]
    );

    res.json({
      success: true,
      campaign: result.rows[0],
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Kampanya güncellenemedi.",
    });
  }
});
app.delete("/campaigns/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM campaigns WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Kampanya bulunamadı.",
      });
    }

    await createAuditLog(
      "admin",
      "campaign_delete",
      `Kampanya silindi: ${result.rows[0].title}`
    );

    res.json({
      success: true,
      campaign: result.rows[0],
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "Kampanya silinemedi.",
    });
  }
});
app.get("/campaigns/mobile", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM campaigns
      WHERE is_active = true
      ORDER BY created_at DESC
    `);

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Kampanyalar getirilemedi.",
    });
  }
});
app.get("/audit-logs", async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT *
      FROM audit_logs
      ORDER BY created_at DESC
      LIMIT 20
    `);

    res.json(result.rows);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Loglar alınamadı",
    });

  }

});
/* =========================
   STORES
========================= */

app.get("/stores", async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT
        id,
        name,
        address,
        latitude,
        longitude,
        radius
      FROM stores
      WHERE is_active = true
      ORDER BY id
    `);

    res.json({
      success: true,
      stores: result.rows,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      error: "Şubeler alınamadı",
    });

  }

});

app.get("/settings", async (req,res)=>{

try{

const result=await pool.query(

"SELECT * FROM settings LIMIT 1"

);

res.json(result.rows[0]);

}catch(err){

console.log(err);

res.status(500).json({
error:"Settings alınamadı"
});

}

});
app.get("/products", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        store_id,
        name,
        price,
        category,
        temperature,
        loyalty_value,
        is_active
      FROM products
      WHERE is_active = true
      ORDER BY
        category,
        name,
        temperature;
      `
    );

    res.json(result.rows);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Ürünler alınamadı",
    });

  }
});
app.put("/settings", async (req,res)=>{

try{

const {
  business_name,
  loyalty_target,
  reward_type,
  admin_username,
  admin_password,
  push_notifications,
  campaign_notifications,
  geofence_notifications,
} = req.body;

const result=
await pool.query(

`
UPDATE settings
SET
business_name = $1,
loyalty_target = $2,
reward_type = $3,
admin_username = $4,
admin_password = $5,
push_notifications = COALESCE($6, push_notifications),
campaign_notifications = COALESCE($7, campaign_notifications),
geofence_notifications = COALESCE($8, geofence_notifications),
updated_at = NOW()
WHERE id = 1
RETURNING *;
`,

[
  business_name,
  loyalty_target,
  reward_type,
  admin_username,
  admin_password,
  push_notifications,
  campaign_notifications,
  geofence_notifications,
]

);
await createAuditLog(
  "admin",
  "settings_update",
  "Sistem ayarları güncellendi"
);
res.json(result.rows[0]);

}catch(err){

console.error("SETTINGS ERROR:", err);

res.status(500).json({

error:"Settings güncellenemedi"

});

}

});
app.patch("/staff/:id/status", async (req, res) => {

  try {

    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE staff_accounts
      SET active = NOT active
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Personel bulunamadı",
      });
    }

    const staff = result.rows[0];

    await createAuditLog(
      "admin",
      "staff_status",
      `${staff.name} ${
        staff.active ? "aktif edildi" : "pasif yapıldı"
      }`
    );

    res.json(staff);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Durum güncellenemedi",
    });

  }

});
app.post("/staff-login", async (req, res) => {

  try {

    const { username, password } = req.body;

    const result = await pool.query(
`
SELECT *
FROM staff_accounts
WHERE LOWER(username)=LOWER($1)
AND active = true
`,
[username]
);

    if (result.rows.length === 0) {

      return res.status(401).json({
        error: "Kullanıcı adı veya şifre yanlış"
      });

    }

    const staff = result.rows[0];
    const validPassword =
  await bcrypt.compare(
    password,
    staff.password
  );

if (!validPassword) {

  return res.status(401).json({
    error:"Kullanıcı adı veya şifre yanlış"
  });

}

    await createAuditLog(
      staff.role,
      "staff_login",
      `${staff.name} giriş yaptı`
    );

    res.json({
      success: true,
      id: staff.id,
      name: staff.name,
      role: staff.role,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Login başarısız",
    });

  }

});

app.put("/staff/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      username,
      password,
      role,
    } = req.body;

    let result;

    if (password && password.trim() !== "") {
      
      const hashedPassword = await bcrypt.hash(password, 10);
      
      result = await pool.query(
        `
        UPDATE staff_accounts
        SET
  name = $1,
  username = $2,
  role = $3,
  password = $4
WHERE id = $5
        RETURNING *
        `,
        [
          name,
          username,
          role,
          hashedPassword,
          id,
        ]
      );

    } else {

      result = await pool.query(
        `
        UPDATE staff_accounts
       SET
  name = $1,
  username = $2,
  role = $3
WHERE id = $4
        RETURNING *
        `,
        [
          name,
          username,
          role,
          id,
        ]
      );

    }

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Personel bulunamadı",
      });
    }

    await createAuditLog(
      "admin",
      "staff_update",
      `${name} (${role}) personeli güncellendi`
    );

    const {
  password: _,
  ...staffData
} = result.rows[0];

res.json(staffData);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Personel güncellenemedi",
    });

  }
});
app.put("/stores/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const {
      name,
      address,
      latitude,
      longitude,
      radius,
      is_active,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE stores

      SET
        name = $1,
        address = $2,
        latitude = $3,
        longitude = $4,
        radius = $5,
        is_active = $6

      WHERE id = $7

      RETURNING *
      `,
      [
        name,
        address,
        latitude,
        longitude,
        radius,
        is_active,
        id,
      ]
    );

    if (result.rows.length === 0) {

      return res.status(404).json({
        error: "Şube bulunamadı",
      });

    }

    res.json({
      success: true,
      store: result.rows[0],
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Şube güncellenemedi",
    });

  }

});
app.put("/products/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const {
      name,
      category,
      temperature,
      price,
      loyalty_value,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE products
      SET
        name = $1,
        category = $2,
        temperature = $3,
        price = $4,
        loyalty_value = $5
      WHERE id = $6
      RETURNING *
      `,
      [
        name,
        category,
        temperature,
        price,
        loyalty_value,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Ürün bulunamadı",
      });
    }

    await createAuditLog(
      "admin",
      "product_updated",
      `${name} ürünü güncellendi`
    );

    res.json({
      success: true,
      product: result.rows[0],
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      error: "Ürün güncellenemedi",
    });

  }
});
app.put("/products/:id/status", async (req, res) => {

  try {

    const { id } = req.params;

    const { is_active } = req.body;

    const result = await pool.query(
      `
      UPDATE products
      SET is_active = $1
      WHERE id = $2
      RETURNING *
      `,
      [
        is_active,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Ürün bulunamadı",
      });
    }

    await createAuditLog(
      "admin",
      is_active ? "product_enabled" : "product_disabled",
      `${result.rows[0].name} ${
        is_active ? "aktif edildi" : "pasif edildi"
      }`
    );

    res.json({
      success: true,
      product: result.rows[0],
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      error: "Durum güncellenemedi",
    });

  }

});
app.post("/stores", async (req, res) => {
  try {
    const {
      name,
      address,
      latitude,
      longitude,
      radius,
      is_active,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO stores
      (
        name,
        address,
        latitude,
        longitude,
        radius,
        is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        name,
        address,
        latitude,
        longitude,
        radius,
        is_active,
      ]
    );

    await createAuditLog(
      "admin",
      "store_create",
      `${name} şubesi oluşturuldu`
    );

    res.status(201).json({
      success: true,
      store: result.rows[0],
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      error: "Şube oluşturulamadı",
    });
  }
});
app.delete("/stores/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM stores
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Şube bulunamadı",
      });
    }

    await createAuditLog(
      "admin",
      "store_delete",
      `${result.rows[0].name} şubesi silindi`
    );

    res.json({
      success: true,
      message: "Şube başarıyla silindi.",
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "Şube silinemedi.",
    });
  }
});
app.delete("/staff/:id", async (req, res) => {

  try {

    const { id } = req.params;

    // Personeli bul
    const staffResult = await pool.query(
      `
      SELECT *
      FROM staff_accounts
      WHERE id = $1
      `,
      [id]
    );

    if (staffResult.rows.length === 0) {

      return res.status(404).json({
        error: "Personel bulunamadı",
      });

    }

    const staff = staffResult.rows[0];

    // Admin hesabı silinemesin
    if (staff.role === "admin") {

      return res.status(400).json({
        error: "Admin hesabı silinemez.",
      });

    }

    await pool.query(
      `
      DELETE FROM staff_accounts
      WHERE id = $1
      `,
      [id]
    );

    await createAuditLog(
      "admin",
      "staff_delete",
      `${staff.name} personeli silindi`
    );

    res.json({
      success: true,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Personel silinemedi",
    });

  }

});
app.delete("/products/:id", async (req, res) => {
  try {

    const { id } = req.params;

    // Bu ürün satılmış mı?
    const salesResult = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM sales
      WHERE product_id = $1
      `,
      [id]
    );

    if (Number(salesResult.rows[0].total) > 0) {

      return res.status(400).json({
        success: false,
        error:
          "Bu ürün geçmiş satışlarda kullanıldığı için silinemez. Pasif yapabilirsiniz.",
      });

    }

    const result = await pool.query(
      `
      DELETE FROM products
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {

      return res.status(404).json({
        success: false,
        error: "Ürün bulunamadı",
      });

    }

    await createAuditLog(
      "admin",
      "product_deleted",
      `${result.rows[0].name} ürünü silindi`
    );

    res.json({
      success: true,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      error: "Ürün silinemedi",
    });

  }
});
app.post("/seed-admin", async (req, res) => {
  try {
    const existing = await pool.query(
      "SELECT id FROM staff_accounts WHERE LOWER(username)=LOWER($1)",
      ["admin"]
    );

    if (existing.rows.length > 0) {

  const hashedPassword = await bcrypt.hash("123456", 10);

  await pool.query(
    `
    UPDATE staff_accounts
    SET
      password = $1,
      active = true
    WHERE LOWER(username)=LOWER($2)
    `,
    [
      hashedPassword,
      "admin",
    ]
  );

  return res.json({
    success: true,
    message: "Admin şifresi güncellendi.",
  });

}

    const hashedPassword = await bcrypt.hash("123456", 10);

    const result = await pool.query(
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
      RETURNING id,name,username,role,active
      `,
      [
        "Admin",
        "admin",
        hashedPassword,
        "admin",
        true,
      ]
    );

    res.json({
      success: true,
      admin: result.rows[0],
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Admin oluşturulamadı.",
    });

  }
});
app.post("/products", async (req, res) => {
  try {

    const {
      store_id,
      name,
      price,
      category,
      temperature,
      loyalty_value,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO products
      (
        store_id,
        name,
        price,
        category,
        temperature,
        loyalty_value
      )
      VALUES($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
      [
        store_id,
        name,
        price,
        category,
        temperature,
        loyalty_value,
      ]
    );

    // Audit log
    await createAuditLog(
      "admin",
      "product_created",
      `${name} ürünü oluşturuldu`
    );

    res.json({
      success: true,
      product: result.rows[0],
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      error: "Ürün eklenemedi",
    });

  }
});
app.post("/sale", async (req, res) => {
  try {

    const {
      userId,
      productId,
      staffId,
    } = req.body;

    // Ürünü getir
    const productResult = await pool.query(
      `
      SELECT *
      FROM products
      WHERE id = $1
      `,
      [productId]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Ürün bulunamadı",
      });
    }

    const product = productResult.rows[0];

    // Satışı kaydet
   await pool.query(
`
INSERT INTO sales
(
  user_id,
  staff_id,
  store_id,
  product_id,
  quantity,
  unit_price,
  total_price,
  loyalty_points
)
VALUES($1,$2,$3,$4,$5,$6,$7,$8)
`,
[
  userId,
  staffId,
  product.store_id,
  productId,
  1,
  product.price,
  product.price,
  product.loyalty_value,
]
);

    // Eski scan mantığını çalıştır
    const userResult = await pool.query(
      `
      SELECT *
      FROM users
      WHERE id = $1
      `,
      [userId]
    );

    const user = userResult.rows[0];
    if (!user) {
  return res.status(404).json({
    success: false,
    error: "Kullanıcı bulunamadı",
  });
}

    let coffeeCount =
  user.coffee_count +
  product.loyalty_value;
    let freeCoffee = user.free_coffee;

    const settings = await pool.query(
      `
      SELECT loyalty_target
      FROM settings
      LIMIT 1
      `
    );

    const target =
      settings.rows[0].loyalty_target;

    if (coffeeCount >= target) {

      coffeeCount = 0;
      freeCoffee++;

    }

    const updated =
      await pool.query(
        `
        UPDATE users
        SET
        coffee_count = $1,
        free_coffee = $2
        WHERE id = $3
        RETURNING *
        `,
        [
          coffeeCount,
          freeCoffee,
          userId,
        ]
      );
await createAuditLog(
  staffId || "staff",
  "sale_completed",
  `${product.name} satıldı - ₺${product.price}`
);
    res.json({
      success: true,
      user: updated.rows[0],
      product,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      error: "Satış yapılamadı",
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