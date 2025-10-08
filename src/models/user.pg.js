import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/pg.js';

class User extends Model {}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    otp: { type: DataTypes.STRING },
    otpExpires: { type: DataTypes.DATE },
    googleId: { type: DataTypes.STRING, unique: true },
    githubId: { type: DataTypes.STRING, unique: true },
    facebookId: { type: DataTypes.STRING, unique: true },
    appleId: { type: DataTypes.STRING, unique: true },
    role: { type: DataTypes.STRING, defaultValue: 'user' },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
    profilePhoto: { type: DataTypes.JSONB, defaultValue: [] },
    location: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: 'User',
    timestamps: true,
  }
);

export default User;
