require('dotenv').config();
const app = require('./app');
const env = require('./config/env');
const log = require('./utils/logger');
const prisma = require('./config/db');

async function main() {
  await prisma.$connect();
  log.info('Database connected');
  app.listen(env.port, () => {
    log.info(`API server running on http://localhost:${env.port}`);
  });
}

main().catch((err) => {
  log.error('Failed to start server', err);
  process.exit(1);
});
