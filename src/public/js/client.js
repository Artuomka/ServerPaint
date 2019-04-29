window.onload = () => {
    const canvas  = document.getElementById('paint-canvas');
    const context = canvas.getContext('2d');
    const socket  = io.connect('127.0.0.1:80');
    let sessionID = socket.io.engine.id;


    const paths   = [[], []];
    canvas.width  = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    context.lineJoin    = "round";
    context.strokeStyle = "black";
    console.log("Hello!");
    let x;
    let y;
    let painting = false;

    class Point {
        constructor(x, y, color, width) {
            this.x     = x;
            this.y     = y;
            this.color = color;
            this.width = width;
        }
    }

    class Path {
        constructor(point, sessionID) {
            this.point    = point;
            this.essionID = sessionID;
        }
    }

    socket.on('connect', () => {
        console.log('connected');
        sessionID = socket.io.engine.id;
        //    getImage();
        //   alert(sessionID);
    });

    function emit(event, data) {
        socket.emit(event, data, sessionID)
    }

    function getImage() {
        let img;
        let sender = new XMLHttpRequest();
        sender.open('GET', 'getImage', true);
        //sender.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        sender.send();
        img          = sender.responseText;
        img          = atob(img);
        let newImage = new Image(img);
        context.drawImage(newImage, 0, 0);
    }

    canvas.onmousedown = (e) => {
        context.beginPath();
        let widthLine = document.getElementById("brush_width").value;
        let colorLine = document.getElementById("color_selector").value;
        painting      = true;
        if (widthLine < 1 || widthLine > 10) {
            widthLine                                    = 5;
            document.getElementById("brush_width").value = 5;
        }
        context.lineWidth = context.strokeStyle = widthLine;
        context.strokeStyle = colorLine;
        painting            = true;
        x                   = e.offsetX;
        y                   = e.offsetY;
        let newPoint        = new Point(x, y, colorLine, widthLine);
        // startPath(newPoint, sessionID);
        emit('startPath', newPoint);

    };

    canvas.onmousemove = (e) => {
        if (painting) {
            let widthLine = document.getElementById("brush_width").value;
            let colorLine = document.getElementById("color_selector").value;
            if (widthLine < 1 || widthLine > 10) {
                widthLine                                    = 5;
                document.getElementById("brush_width").value = 5;
            }
            context.lineTo(e.offsetX, e.offsetY);
            context.closePath();
            context.stroke();
            x = e.offsetX;
            y = e.offsetY;
            context.moveTo(x, y);
            let newPoint = new Point(x, y, colorLine, widthLine);
            //  continuePath(newPoint, sessionID);
            emit('continuePath', newPoint);
        }
    };

    canvas.onmouseup = canvas.onmouseleave = (e) => {
        let widthLine = document.getElementById("brush_width").value;
        let colorLine = document.getElementById("color_selector").value;
        if (widthLine < 1 || widthLine > 10) {
            widthLine                                    = 5;
            document.getElementById("brush_width").value = 5;
        }
        painting = false;
        x        = e.offsetX;
        y        = e.offsetY;
        context.moveTo(x, y);
        let newPoint = new Point(x, y, colorLine, widthLine);
        //   endPath(newPoint, sessionID);
        emit('endPath', newPoint);
    };


    socket.on('startPath', function startPath(point, sessionID) {
        context.lineJoin = "round";
        context.beginPath();
        context.lineWidth   = point.width;
        context.strokeStyle = point.color;
        context.moveTo(point.x, point.y);
        //  console.log('startPatch Emitted');
    });

    socket.on('continuePath', function continuePath(point, sessionID) {
        context.lineTo(point.x, point.y);
        context.closePath();
        context.stroke();
        context.moveTo(point.x, point.y);
        // console.log('ContinuePatch Emitted');
    });

    socket.on('endPath', function endPath(point, sessionID) {
        // console.log('endPatch Emitted');
    });

    socket.on('drawPoints', function drawPoints(pointsArray) {
        // console.log('DrawPoints emitted');
        // console.log(pointsArray);

        for (let i = 0; i < pointsArray.length; i++) {
            context.lineJoin = "round";
            context.beginPath();
            context.lineWidth   = pointsArray[i].width;
            context.strokeStyle = pointsArray[i].color;
            context.moveTo(pointsArray[i].beginPointX, pointsArray[i].beginPointY);
            context.lineTo(pointsArray[i].endPointX, pointsArray[i].endPointY);
            context.closePath();
            context.stroke();
     //       context.moveTo(pointsArray[i].endPointX, pointsArray[i].endPointY);
        }

    });


};
