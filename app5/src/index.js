const net = require("node:net");

const {
  assertQueue,
  sendToQueue,
  consumeQueue,
  closeConnection,
} = require("./config/rabbitmq");

const server = net.createServer((socket) => {
  socket.write("Bem-vindos ao servidor de filas da lavanderia lava-lava \n\r");
  socket.write("Envie sua mensagem a baixo: \n\r\n\r");

  socket.on("data", (data) => {
    const message = data.toString();

    assertQueue("laungeryMatriz");
    sendToQueue(
      "laungeryMatriz",
      JSON.stringify({
        filial4: {
          message,
        },
      })
    );

    socket.write("Mensagem enviada com sucesso! \n\r");

    closeConnection();
  });

  consumeQueue("laungery", (msg) => {
    socket.write("\n\r\n\r Nova mensagem:  \n\r");
    socket.write(msg.content.toString());
  });
});

server.listen(3004, () => {
  console.log("Server is listening on port 3004");
});
