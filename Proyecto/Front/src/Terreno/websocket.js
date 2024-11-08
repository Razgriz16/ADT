const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('Cliente conectado');

  // Ejemplo: emite un evento cuando detectes un cambio en la base de datos
  // Aquí podrías usar un trigger de base de datos o un middleware para emitir eventos
  someDatabaseWatcher.on('dataUpdated', (updatedData) => {
    socket.emit('updateProgress', updatedData);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(5000, () => {
  console.log('Servidor escuchando en el puerto 5000');
});
