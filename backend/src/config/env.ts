import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || '3000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  HISTORY_FILE_PATH: process.env.HISTORY_FILE_PATH || path.join(process.cwd(), 'analysis_history.json'),
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
};
