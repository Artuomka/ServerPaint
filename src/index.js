const express      = require('express');
const app          = express();
const server       = require('http').Server(app);
const io           = require('socket.io')(server);
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const path         = require('path');

const port             = 80;
const urlencodedParser = bodyParser.urlencoded({extended: false});

const connections = []; //users connections array


app.use('/static', express.static('public'));

app.get('/',urlencodedParser, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

app.get('/client.js', (req, res) => {
    res.sendFile(path.join(__dirname), 'public', 'js', 'client.js');
});

app.get('/client.css', (req, res) => {
    res.sendFile(path.join(__dirname), 'public', 'css', 'client.css');
});

io.on('connection', (socket)=>{
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    socket.on('disconnect', (data)=>{
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });

    // socket.on('', (data) => {
    //     //генерируем событие и отправляем доступным клиентам
    //     io.sockets.emit('', data);
    // });
});


server.listen(port, ()=>{
    console.log ('Server running on port ' +port);
});