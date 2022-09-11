import { registerAs } from '@nestjs/config';

export default registerAs('mongodb', () => ({
  user: process.env.DB_USER || null,
  pass: process.env.DB_PASS || null,
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || null,
  name: process.env.DB_NAME || 'botsup'

}));