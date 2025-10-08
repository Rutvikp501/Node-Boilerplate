import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.pg.js';
import { s3Upload, s3Delete } from '../utils/s3.js';
import { generateOTP, SendOTP } from '../utils/otp.js';
import dotenv from 'dotenv';
dotenv.config();

const FOLDER = process.env.FOLDER;

const hashPassword = async (pwd) => bcrypt.hash(pwd, 10);
const comparePassword = async (pwd, hash) => bcrypt.compare(pwd, hash);
const generateToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

// Register
export const pgregisterUser = async (req, res) => {
  try {
    const { name, email, password, phone, role, isAdmin } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    let profilePhoto = [];
    if (req.file) {
      const uploaded = await s3Upload(req.file, FOLDER);
      profilePhoto = [{ publicId: uploaded.key, url: uploaded.url }];
    }

    const hashed = await hashPassword(password);
    const user = await User.create({ name, email, phone, password: hashed, role, isAdmin, profilePhoto });
    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

// Login
export const pgloginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const valid = await comparePassword(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const token = generateToken(user);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Forgot Password (Send OTP)
export const pgforgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    await SendOTP(email, otp);
    res.status(200).json({ message: 'OTP sent to email' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending OTP', error: err.message });
  }
};

// Verify OTP
export const pgverifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || user.otp !== otp || user.otpExpires < Date.now())
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    res.json({ message: 'OTP verified' });
  } catch (err) {
    res.status(500).json({ message: 'OTP verification failed', error: err.message });
  }
};

// Reset Password
export const pgresetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || user.otp !== otp || user.otpExpires < Date.now())
      return res.status(400).json({ message: 'Invalid or expired OTP' });

    user.password = await hashPassword(newPassword);
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Password reset failed', error: err.message });
  }
};

// CRUD
export const pggetAllUsers = async (_, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

export const pggetUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
};

export const pgupdateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (req.file) {
      const uploaded = await s3Upload(req.file, FOLDER);
      if (user.profilePhoto?.[0]?.publicId) await s3Delete(user.profilePhoto[0].publicId);
      updates.profilePhoto = [{ publicId: uploaded.key, url: uploaded.url }];
    }

    await user.update(updates);
    res.json({ message: 'User updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err.message });
  }
};

export const pgdeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.profilePhoto?.[0]?.publicId) await s3Delete(user.profilePhoto[0].publicId);
    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
};
