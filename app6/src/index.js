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

    assertQueue("laungeryMatriz");
    sendToQueue(
      "laungeryMatriz",
      JSON.stringify({
        filial5: {
          message,
        },
      })
    );

    socket.write("Mensagem enviada com sucesso! \n");

    closeConnection();
  });

  consumeQueue("laungery", (msg) => {
    socket.write("\n\n Nova mensagem:  \n");
    socket.write(msg.content.toString());
  });
});

server.listen(3005, () => {
  console.log("Server is listening on port 3005");
});
