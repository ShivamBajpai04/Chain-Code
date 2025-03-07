
dotenv.config();

// const auth = async (req, res, next) => {
//   const token = req.header("Authorization"); // Bearer token
//   console.log("------------------", token);
//   if (!token)
//     return res.status(401).json({ msg: "No token, authorization denied" });

//   try {
//     const decoded = await jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded
//     next();
//   } catch (err) {
//     console.log(err)
//     res.status(401).json({ msg: "Token is not valid" });
//   }
// };

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const auth = async (req, res, next) => {
  const token = req.header("Authorization"); // Bearer token
  console.log("------------------", token);
  if (!token) // Check if token is present and starts with "Bearer "
    return res.status(401).json({ msg: "No token, authorization denied" });

  const actualToken = token; // Extract the actual token

  try {
    const decoded = await jwt.verify(actualToken, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user information to the request
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.log(err);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export default auth;


