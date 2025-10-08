import amqp from "amqplib";
import { redisClient } from "./redis.js";
import { sql } from "./db.js";

interface CachedInvalidatonMessage {
  action: string;
  keys: string[];
}
export const startCacheConsumer = async () => {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: process.env.Rabitmq_Host,
      port: process.env.Rabitmq_Port
        ? Number(process.env.Rabitmq_Port)
        : undefined,
      username: process.env.Rabitmq_userName,
      password: process.env.Rabitmq_Password,
    });
    const channel = await connection.createChannel();
    const queueName = "cache-invalidation";
    await channel.assertQueue(queueName, { durable: true });
    console.log("✅Blog service consumer started");
    channel.consume(queueName, async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(
            msg.content.toString()
          ) as CachedInvalidatonMessage;
          console.log(
            "📩Blog service received cache Invalidation message",
            content
          );
          if (content.action === "invalidateCache") {
            for (const pattern of content.keys) {
              const keys = await redisClient.keys(pattern);
              if (keys.length > 0) {
                await redisClient.del(keys);
                console.log(
                  `🗑️Blog service invalidated ${keys.length} caches keys matching ${pattern}`
                );

                const serchQuery = "";
                const category = "";
                const cacheKey = `blogs:${serchQuery}:${category}`;
                const blogs =
                  await sql`SELECT * FROM blog ORDER BY create_at DESC`;
                await redisClient.set(cacheKey, JSON.stringify(blogs), {
                  EX: 3600,
                });
                console.log("🔄️Cache rebuilt with key:", cacheKey);
              }
            }
          }
          channel.ack(msg);
        } catch (error) {
          console.log("Error processing cache invalidation message:", error);
          channel.nack(msg, false, true);
        }
      }
    });
  } catch (error) {
    console.log("failed to connect blog service to rabbitmq", error);
  }
};
