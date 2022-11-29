const amqp = require("amqplib");

const {url} = require("./index");

async function consumeQueue(queue, callback) {
  const connection = await amqp.connect(url);
  const channel = await connection.createChannel();

  await channel.assertQueue(queue);
  await channel.consume(queue, callback);
}

async function closeConnection() {
  const connection = await amqp.connect(url);
  await connection.close();
}

async function assertQueue(queue) {
  const connection = await amqp.connect(url);
  const channel = await connection.createChannel();

  await channel.assertQueue(queue);
}

async function sendToQueue(queue, message) {
  const connection = await amqp.connect(url);
  const channel = await connection.createChannel();

  await channel.sendToQueue(queue, Buffer.from(message));
}

module.exports = {
  consumeQueue,
  assertQueue,
  sendToQueue,
  closeConnection,
};
