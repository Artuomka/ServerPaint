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
const pointsArray = []; //recieve points array;
let counter       = 0;
let roomPathArray = [[]];

// class Path {
//     constructor(beginPointX, beginPointY, endPointX, endPointY, color, width) {
//         this.beginPointX = beginPointX;
//         this.beginPointY = beginPointY;
//         this.endPointX   = endPointX;
//         this.endPointY   = endPointY;
//         this.color       = color;
//         this.width       = width;
//     }
// }

let img;

app.use('/static', express.static('public'));

// app.get('/', urlencodedParser, (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
// });

app.get('/painting', urlencodedParser, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

app.get('/client.js', (req, res) => {
    res.sendFile(path.join(__dirname), 'public', 'js', 'client.js');
});

app.get('Painter.js', (req, res) => {
    res.sendFile(path.join(__dirname), 'public', 'js', 'Painter.js');
});

app.get('/client.css', (req, res) => {
    res.sendFile(path.join(__dirname), 'public', 'css', 'client.css');
});

app.get('/', urlencodedParser, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'intro.html'));
});

app.get('/intro.js', (req, res) => {
    res.sendFile(path.join(__dirname), 'public', 'js', 'intro.js');
});

app.get('/intro.css', (req, res) => {
    res.sendFile(path.join(__dirname), 'public', 'css', 'intro.css');
});

/*function createPath(roomname, beginPointX, beginPointY, endPointX, endPointY, beginPointColor, beginPointWidth) {
    let newPath = new Path(beginPointX, beginPointY, endPointX, endPointY, beginPointColor, beginPointWidth);
    roomPathArray[roomname - 1].push(newPath);
}*/

function createPath(roomname, path) {
    roomPathArray[roomname - 1].push(path);
}

//            ------------------ROOMS-------------------------
let namespace = io.of('/namespace');

namespace.on('connection', (socket) => {
    let room = '';

    socket.on('getImage', () => {
        namespace.emit('setRooms', counter);
        namespace.emit('drawPreview', roomPathArray);

    });

    socket.on('createRoom', (divRoom) => {
        console.log('createRoom Emitted');
        roomPathArray.push([[]]);
        counter++;
        console.log('room count ' + counter);
        socket.emit('room_created');
    });

    socket.on('img_click', (data) => {
        for (let i = 1; i <= counter; i++) {
            if (data.room == i) {
                room = "room" + data.room;
                socket.join(room);
                console.log('img_click emitted from room' + data.room);
                socket.emit('joinRoom', {roomname: i, location: "/painting"});
                break;
            }
        }
    });

    socket.on('img_ready_paint', (data) => {
        for (let i = 1; i <= counter; i++) {
            if (data.room == i) {
                room = "room" + data.room;
                socket.join(room);
                console.log('img_ready_paint emitted from room' + data.room);
                break;
            }
        }

        socket.on('painting', (roomname) => {

            console.log('Connection Emitted to Room ' + roomname);
            let beginPoint; //variables for
            let endPoint;   //recieved points
            let firstPoint;
            let secondPoint;
            let localRoomPatchArray = ArrayDoubleToOne(roomname - 1, roomPathArray);

            namespace.to(room).emit('drawPoints', localRoomPatchArray);
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
                namespace.to(room).emit('startPath', data, sessionID);
                beginPoint = data;
                pointsArray.push(beginPoint);
                firstPoint = beginPoint;
            });

            socket.on('continuePath', (dataPoint, dataPath, sessionID) => {
                namespace.to(room).emit('continuePath', dataPoint, dataPath, sessionID);
                endPoint = dataPoint;
                pointsArray.push(endPoint);
                createPath(roomname, dataPath);
                firstPoint = endPoint;

            });

            socket.on('endPath', (data, sessionID) => {
                //add point draw
            });
        });

    });

});

function ArrayDoubleToOne(index, array) {
    let returnArray = [];
    for (let i = 0; i < array[index].length; i++) {
        returnArray[i] = array[index][i];
    }
    return returnArray;
}

server.listen(port, () => {
    console.log('Server running on port ' + port);
});

