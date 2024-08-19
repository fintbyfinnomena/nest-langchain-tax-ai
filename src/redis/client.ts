import Redis, { RedisOptions } from 'ioredis';
import { getConfig } from 'src/config/tax.chat.config';

let client: Redis | null = null;

const config = getConfig();

export const getRedisClient = () => {
  if (!client) {
    createClient();
  }

  return client;
};

const createClient = () => {
  const isLocalEnv = process.env.NODE_ENV === 'local'; // Adjust based on your local environment setup
  const redisOptions: RedisOptions = {
    host: config.redisHost,
    port: parseInt(config.redisPort),
    username: config.redisUsername,
    password: config.redisPassword,
  };

  // if (!isLocalEnv) {
  //   redisOptions.tls = {
  //     host: config.redisHost,
  //   };
  // }

  client = new Redis(redisOptions);
};
