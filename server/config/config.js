import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  square: {
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
    environment: process.env.SQUARE_ENVIRONMENT || 'sandbox',
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
};
