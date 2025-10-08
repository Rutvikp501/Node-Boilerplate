import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
  process.env.PG_DATABASE || 'node-boilerplate',
  process.env.PG_USER || 'postgres',
  process.env.PG_PASSWORD || 'postgres',
  {
    host: process.env.PG_HOST || 'localhost',
    port: process.env.PG_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    dialectOptions:
      process.env.PG_HOST !== 'localhost'
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {},
  }
);

export const PGConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL Connected via Sequelize');
  } catch (err) {
    console.error('❌ Sequelize connection failed:', err);
  }
};
