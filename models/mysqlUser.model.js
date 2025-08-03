// models/User.sql.js
import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '../config/sequelize.js';

const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING, allowNull: false }, // Password field
  age: DataTypes.INTEGER,
  phone: DataTypes.STRING,
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'users',
  timestamps: false,
});

// 🔐 Hash password before create/update
User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});

User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

// 🔐 Method to compare password
User.prototype.comparePassword = function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

export default User;
