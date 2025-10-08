import amqp from "amqplib";

let channel: amqp.Channel;

export const connectRabbitmq = async () => {
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
    channel = await connection.createChannel();
    console.log("✅ connected to Rabbitmq");
  } catch (error) {
    console.log("failed connection to rabbitmq", error);
  }
};

export const publisToQueue = async (queueName: string, message: any) => {
  if (!channel) {
    console.error("Rabbitmq is not intialized");
    return;
  }
  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
};

export const invalidateChacheJob = async (cacheKey: string[]) => {
  try {
    const message = {
      action: "invalidateCache",
      keys: cacheKey,
    };
    await publisToQueue("cache-invalidation", message);
    console.log("✅cache-invalidation job published to Rabbitmq");
  } catch (error) {
    console.log("failed to Published cache on Rabbitmq", error);
  }
};
