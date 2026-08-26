import { getAddress } from "ethers";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WALLET_RE = /^0x[a-fA-F0-9]{40}$/;

export const register = async (req, res) => {
  const { username, email, password, walletAddress } = req.body;

  // --- validation: always 400 with a reason, never a bare 500 ---
  if (!username || username.trim().length < 3)
    return res.status(400).json({ msg: "Username must be at least 3 characters." });
  if (!email || !EMAIL_RE.test(email))
    return res.status(400).json({ msg: "Enter a valid email address." });
  if (!password || password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password))
    return res
      .status(400)
      .json({ msg: "Password needs 8+ characters, one uppercase letter and one number." });
  if (!walletAddress || !WALLET_RE.test(walletAddress))
    return res.status(400).json({ msg: "Wallet address must be a valid Ethereum address (0x + 40 hex characters)." });

  // hex format alone isn't enough — a mixed-case address with a bad EIP-55
  // checksum passes WALLET_RE but fails every mint later with no earlier
  // warning. getAddress() also normalizes to the canonical checksummed form.
  let checksummedWallet;
  try {
    checksummedWallet = getAddress(walletAddress);
  } catch {
    return res.status(400).json({
      msg: "That wallet address has an invalid checksum — copy it directly from your wallet app rather than typing it.",
    });
  }

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(409).json({ msg: "An account with this email already exists." });

    user = new User({ username: username.trim(), email, password, walletAddress: checksummedWallet });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Generate JWT
    const payload = { user: { id: user.id, walletAddress: checksummedWallet, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token });
  } catch (err) {
    // duplicate unique key (username / wallet) -> say which field
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || "field";
      const label = field === "walletAddress" ? "wallet address" : field;
      return res
        .status(409)
        .json({ msg: `That ${label} is already registered.` });
    }
    console.error("register error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Generate JWT
    const payload = {
      user: { id: user.id, walletAddress: user.walletAddress, role: user.role },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token });
  } catch (err) {
    res.status(500).send("Server error");
  }
};
