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


// roomPathArray[0].push(1, 2, 3, 4);
// roomPathArray[1].push(8, 7, 9, 5);


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

// app.get('/', urlencodedParser, (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
// });

app.get('/painting', urlencodedParser, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});


app.get('/client.js', (req, res) => {
    res.sendFile(path.join(__dirname), 'public', 'js', 'client.js');
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

function createPath(roomname, beginPointX, beginPointY, endPointX, endPointY, beginPointColor, beginPointWidth) {
    let newPath = new Path(beginPointX, beginPointY, endPointX, endPointY, beginPointColor, beginPointWidth);
    roomPathArray[roomname - 1].push(newPath);
}

//            ------------------ROOMS-------------------------
let namespace = io.of('/namespace');

namespace.on('connection', (socket) => {
    let room = '';

    socket.on('getImage', () => {
        namespace.emit('setRooms', counter);
        // console.log('getImage Emitted');
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
                // socket.emit('joinRoom', {roomname: i, location: "/painting"});
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
            //  console.log(roomPathArray[1][2]);
            connections.push(socket);
            console.log('Connected: %s sockets connected', connections.length);

            socket.on('disconnect', () => {
                connections.splice(connections.indexOf(socket), 1);
                console.log('Disconnected: %s sockets connected', connections.length);
            });

            socket.on('', (data) => {
                //генерируем событие и отправляем доступным клиентам
                io.sockets.emit('', data);
            });

            socket.on('startPath', (data, sessionID) => {
                namespace.to(room).emit('startPath', data, sessionID);
                beginPoint = data;
                pointsArray.push(beginPoint);
                firstPoint = beginPoint;
                //  console.log('startPathEmitted')
            });

            socket.on('continuePath', (data, sessionID) => {
                namespace.to(room).emit('continuePath', data, sessionID);
                endPoint = data;
                pointsArray.push(endPoint);
                createPath(roomname, firstPoint.x, firstPoint.y, endPoint.x, endPoint.y, firstPoint.color, firstPoint.width);
                firstPoint = endPoint;
                // console.log('continuePatch emitted')
            });

            socket.on('endPath', (data, sessionID) => {
                namespace.to(room).emit('endPath', data, sessionID);
                //  console.log('endPatch emitted')
            });
        });


    });

});


function ArrayDoubleToOne(index, array) {
    let returnArray = [];
    for (let i = 0; i < array[index].length; i++) {
        returnArray[i] = array[index][i];
    }
    // console.log(returnArray);
    return returnArray;
}

server.listen(port, () => {
    console.log('Server running on port ' + port);
});

