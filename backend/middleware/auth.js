import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.split(" ")[1]; // Bearer token
  console.log("sex, ",token)
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    console.log("try", token)
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = decoded;
    console.log("aaa");
    next();
    console.log("aaa11");
  } catch (err) {
    console.log("catch", token)
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export default auth;
