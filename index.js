const http = require('http');
const express = require('express');
const cors = require('cors')

//config .env
require('dotenv').config();

//creamos app de express
const app = express();

//config app de express
app.use(cors())

const server = http.createServer()

const PORT = process.env.PORT || 3000;
server.listen(PORT);

server.on('listening', () => {
    console.log(`servidor escuchando con auriculares el puerto ${PORT}`)
})

//config socket.io
const io = require('socket.io')(server, {
    cors: {
        origin: "*"
    }
});
io.on('connection', (socket) => {
    //se ejecuta segun las personas que se conecten
    console.log('Se ha conectado un nuevo cliente')
    //mandar un msj a todos los clientes menos al que se conecta
    socket.broadcast.emit('mensajecito', {
        usuario: 'INFO', mensaje: 'Se ha conectado un nuevo usuario'
    })

    //actualizo el numero de clientes conectados 
    io.emit('clientes_conectados', io.engine.clientsCount)

    socket.on('mensajecito', (data) => {
        console.log(data)
        io.emit('mensajecito', data)
    })

    socket.on('disconnect', () => {
        io.emit('mensajecito', {
            usuario: 'INFO', mensaje: 'Se ha desconectado un nuevo usuario'
        })
        io.emit('clientes_conectados', io.engine.clientsCount)
    })
})