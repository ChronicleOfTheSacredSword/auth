import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const poolConfig: PoolConfig = {
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
};

const pool = new Pool(poolConfig);

pool.on('connect', () => {
  	console.log('Connected to the database');
});

export default pool;
