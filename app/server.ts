import { Pool } from 'pg';

let pool: Pool | null = null;

export function getPool() {
    if (!pool) {
        pool = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'postgres',
            password: 'postgres',
            port: 5432,
        });
    }
    return pool;
}

export async function closePool() {
    if (pool) {
        await pool.end();
        pool = null;
    }
}

process.on('SIGTERM', async () => {
    await closePool();
    process.exit(0);
});

process.on('SIGINT', async () => {
    await closePool();
    process.exit(0);
});

export function handleError(error: Error) {
    console.error("wowowo: "+error);
    return {
        message: error.message,
        stack: error.stack,
    };
}