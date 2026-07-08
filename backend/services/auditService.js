const pool = require("../config/db");

async function createAuditLog(
  role,
  action,
  description
) {
  try {

    await pool.query(
      `
      INSERT INTO audit_logs
      (
        user_role,
        action,
        description
      )

      VALUES ($1,$2,$3)
      `,
      [
        role,
        action,
        description,
      ]
    );

  } catch (err) {

    console.log(err);

  }
}

module.exports = {
  createAuditLog,
};