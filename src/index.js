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
const pathsArray  = []; //users drawed curves array
const pointsArray = []; //recieved points array;

class Path {
    constructor(beginPointX, beginPointY, endPointX, endPointY, color, width) {
        this.beginPointX = beginPointX;
        this.beginPointY = beginPointY;
        this.endPointX   = endPointX;
        this.endPointY   = endPointY;
        this.color       = color;
        this.width       = width;
    }
}

let img;

app.use('/static', express.static('public'));

app.get('/', urlencodedParser, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

app.get('/client.js', (req, res) => {
    res.sendFile(path.join(__dirname), 'public', 'js', 'client.js');
});

app.get('/client.css', (req, res) => {
    res.sendFile(path.join(__dirname), 'public', 'css', 'client.css');
});

// app.get('/getImage', (req, res) => {
//     connections.indexOf(socket).emit('giveImage');
// });

io.on('connection', (socket) => {
    let beginPoint; //variables for
    let endPoint;   //recieved points
    let firstPoint;
    let secondPoint;

    socket.emit('drawPoints', pathsArray);
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    socket.on('disconnect', () => {
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });

    // socket.on('', (data) => {
    //     //генерируем событие и отправляем доступным клиентам
    //     io.sockets.emit('', data);
    // });


    socket.on('startPath', (data, sessionID) => {
        io.sockets.emit('startPath', data, sessionID);
        beginPoint = data;
        pointsArray.push(beginPoint);
        firstPoint = beginPoint;
        //  console.log('startPathEmitted')
    });

    socket.on('continuePath', (data, sessionID) => {
        io.sockets.emit('continuePath', data, sessionID);
        endPoint = data;
        pointsArray.push(endPoint);
        createPath(firstPoint.x, firstPoint.y, endPoint.x, endPoint.y, firstPoint.color, firstPoint.width );
        firstPoint = endPoint;
        // console.log('continuePatch emitted')
    });

    socket.on('endPath', (data, sessionID) => {
        io.sockets.emit('endPath', data, sessionID);
        //  console.log('endPatch emitted')
    });
});

function createPath(beginPointX, beginPointY, endPointX, endPointY, beginPointColor, beginPointWidth){
    let newPath = new Path(beginPointX, beginPointY, endPointX, endPointY, beginPointColor, beginPointWidth);
    pathsArray.push(newPath);
}

server.listen(port, () => {
    console.log('Server running on port ' + port);
});