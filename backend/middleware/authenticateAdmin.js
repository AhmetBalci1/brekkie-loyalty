const jwt = require("jsonwebtoken");

function authenticateAdmin(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: "Token bulunamadı.",
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    (err, decoded) => {

      if (err) {
        return res.status(403).json({
          error: "Geçersiz token.",
        });
      }

      if (decoded.role !== "admin") {
        return res.status(403).json({
          error: "Bu işlem için admin yetkisi gerekiyor.",
        });
      }

      req.user = decoded;

      next();

    }
  );

}

module.exports = authenticateAdmin;