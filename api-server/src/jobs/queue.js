require('dotenv').config();
const { Queue } = require("bullmq");

/**
 * Redis connection configuration object.
 *
 * @type {{ host: string, port: string|number, tls: object|undefined }}
 * 
 * - `host`: The Redis server hostname, loaded from the `AWS_REDIS_HOST` environment variable.
 * - `port`: The Redis server port, loaded from the `AWS_REDIS_PORT` environment variable.
 * - `tls`: If `AWS_REDIS_TLS` environment variable is set to "true", enables TLS with default options; otherwise, TLS is disabled.
 *
 * Note for developers and future self:
 * Ensure that the required environment variables are set before starting the server.
 * Adjust the TLS configuration as needed for your deployment environment.
 */
const connection = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  //tls: process.env.AWS_REDIS_TLS === "true" ? {} : undefined,
};

const emailQueue = new Queue("emailQueue", { connection });
module.exports = { emailQueue };