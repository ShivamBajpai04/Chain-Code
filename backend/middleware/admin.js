import dotenv from "dotenv";
dotenv.config();

// Audit finding #9: problem create/update/delete must be admin-only.
// Requires auth to have run first (req.user populated). Roles live in the JWT
// payload; existing tokens minted before this change lack a role and are
// rejected here — admins simply log in again after deploy.
const admin = (req, res, next) => {
  if (req.user?.user?.role !== "admin") {
    return res.status(403).json({ msg: "Admin access required" });
  }
  next();
};

export default admin;
