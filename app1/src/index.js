const net = require("node:net");

const {
  assertQueue,
  sendToQueue,
  consumeQueue,
  closeConnection,
} = require("./config/rabbitmq");

const server = net.createServer((socket) => {
  socket.write("Bem-vindos ao servidor de filas da lavanderia lava-lava \n");
  socket.write("Envie sua mensagem a baixo: \n\n");

  socket.on("data", (data) => {
    const message = data.toString();

    assertQueue("laungery");
    sendToQueue(
      "laungery",
      JSON.stringify({
        matriz: {
          message,
        },
      })
    );

    socket.write("Mensagem enviada com sucesso! \n");

    closeConnection();
  });

  consumeQueue("laungeryMatriz", (msg) => {
    socket.write("\n\n Nova mensagem:  \n");
    socket.write(msg.content.toString());

    assertQueue("laungery");
    sendToQueue(
      "laungery",
      JSON.stringify({
        matriz: {
          message: msg.content.toString(),
        },
      })
    );
  });

  closeConnection();
});

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
