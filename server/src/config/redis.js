const Redis = require('ioredis');
const logger = require('./logger');

class RedisClient {
  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3
    });

    this.client.on('connect', () => {
      logger.info('✅ Redis Connected');
    });

    this.client.on('error', (err) => {
      logger.error('Redis Error:', err);
    });
  }

  async get(key) {
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('Redis get error:', error);
      return null;
    }
  }

  async set(key, value, ttl = 3600) {
    try {
      await this.client.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.error('Redis set error:', error);
      return false;
    }
  }

  async del(key) {
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      logger.error('Redis del error:', error);
      return false;
    }
  }

  async clearPattern(pattern) {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length) {
        await this.client.del(keys);
      }
      return true;
    } catch (error) {
      logger.error('Redis clear pattern error:', error);
      return false;
    }
  }

  async increment(key, by = 1) {
    try {
      return await this.client.incrby(key, by);
    } catch (error) {
      logger.error('Redis increment error:', error);
      return null;
    }
  }

  async sadd(key, ...members) {
    try {
      return await this.client.sadd(key, ...members);
    } catch (error) {
      logger.error('Redis sadd error:', error);
      return null;
    }
  }

  async smembers(key) {
    try {
      return await this.client.smembers(key);
    } catch (error) {
      logger.error('Redis smembers error:', error);
      return [];
    }
  }
}

module.exports = new RedisClient();