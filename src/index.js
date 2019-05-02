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
let roomPathArray = [[], [], [], []];

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

// app.get('/getImage', (req, res) => {
//     connections.indexOf(socket).emit('giveImage');
// });

// io.on('connection', (socket) => {
//     let beginPoint; //variables for
//     let endPoint;   //recieved points
//     let firstPoint;
//     let secondPoint;
//
//     socket.emit('drawPoints', pathsArray);
//     connections.push(socket);
//     console.log('Connected: %s sockets connected', connections.length);
//
//     socket.on('disconnect', () => {
//         connections.splice(connections.indexOf(socket), 1);
//         console.log('Disconnected: %s sockets connected', connections.length);
//     });
//
//     // socket.on('', (data) => {
//     //     //генерируем событие и отправляем доступным клиентам
//     //     io.sockets.emit('', data);
//     // });
//
//
//     socket.on('startPath', (data, sessionID) => {
//         io.sockets.emit('startPath', data, sessionID);
//         beginPoint = data;
//         pointsArray.push(beginPoint);
//         firstPoint = beginPoint;
//         //  console.log('startPathEmitted')
//     });
//
//     socket.on('continuePath', (data, sessionID) => {
//         io.sockets.emit('continuePath', data, sessionID);
//         endPoint = data;
//         pointsArray.push(endPoint);
//         createPath(firstPoint.x, firstPoint.y, endPoint.x, endPoint.y, firstPoint.color, firstPoint.width);
//         firstPoint = endPoint;
//         // console.log('continuePatch emitted')
//     });
//
//     socket.on('endPath', (data, sessionID) => {
//         io.sockets.emit('endPath', data, sessionID);
//         //  console.log('endPatch emitted')
//     });
// });

// function createPath(beginPointX, beginPointY, endPointX, endPointY, beginPointColor, beginPointWidth) {
//     let newPath = new Path(beginPointX, beginPointY, endPointX, endPointY, beginPointColor, beginPointWidth);
//     pathsArray.push(newPath);
// }

function createPath(roomname, beginPointX, beginPointY, endPointX, endPointY, beginPointColor, beginPointWidth) {
    let newPath = new Path(beginPointX, beginPointY, endPointX, endPointY, beginPointColor, beginPointWidth);
    roomPathArray[roomname - 1].push(newPath);
}


//            ------------------ROOMS-------------------------
let namespace = io.of('/namespace');






namespace.on('connection', (socket) => {
    let room = '';

    socket.on('getImage', ()=>{
        console.log('getImage Emitted');
        namespace.emit('drawPreview', roomPathArray);
    });

    socket.on('img_click', (data) => {
        switch (data.room) {
            case 1:
                room = "room1";
                socket.join(room);
                console.log('img_click emitted from room' + data.room);
                socket.emit('joinRoom', {roomname: 1, location: "/painting"});
                break;
            case 2:
                room = "room2";
                socket.join(room);
                console.log('img_click emitted from room' + data.room);
                socket.emit('joinRoom', {roomname: 2, location: "/painting"});
                break;
            case 3:
                room = "room3";
                socket.join(room);
                console.log('img_click emitted from room' + data.room);
                socket.emit('joinRoom', {roomname: 3, location: "/painting"});
                break;
            case 4:
                room = "room4";
                socket.join(room);
                console.log('img_click emitted from room' + data.room);
                socket.emit('joinRoom', {roomname: 4, location: "/painting"});
                break;
            default:
                console.log('Something wrong in room selecting'); //допилить ответ для клиента
                break;


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

