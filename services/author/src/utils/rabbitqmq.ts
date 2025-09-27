import amqp from "amqplib";

let channel: amqp.Channel;

export const connectRabbitmq = async () => {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: "localhost",
      port: 5672,
      username: "admin",
      password: "admin123",
    });
    channel = await connection.createChannel();
    console.log("✅ connected to Rabbitmq");
  } catch (error) {
    console.log("failed connection to rabbitmq", error);
  }
};
