// noinspection JSAnnotator
window.onload = () => {
    const canvas   = document.getElementById('paint-canvas');
    const btnPaint = document.getElementById('btnPaint');
    let point1;
    let point2;

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

    const context   = canvas.getContext('2d');
    const namespace = io('/namespace');
    const roomname  = getCookie('room');
    console.log('Room number: ' + roomname);

    namespace.on('connect', (socket) => {
        namespace.emit('img_ready_paint', {room: +roomname});
    });

    let sessionID = namespace.io.engine.id;

    canvas.width  = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    context.lineJoin    = "round";
    context.strokeStyle = "black";
    console.log("Hello!");
    let x;
    let y;
    let painting    = false;
    let webPainting = false;

    class Point {
        constructor(x, y, color, width) {
            this.x     = x;
            this.y     = y;
            this.color = color;
            this.width = width;
        }
    }

    namespace.on('connect', () => {
        console.log('connected');
        sessionID = namespace.io.engine.id;
    });

    namespace.emit('painting', roomname);

    function emit(event, point, path) {
        namespace.emit(event, point, path, sessionID)
    }

    // function getImage() {
    //     let img;
    //     let sender = new XMLHttpRequest();
    //     sender.open('GET', 'getImage', true);
    //     sender.send();
    //     img          = sender.responseText;
    //     img          = atob(img);
    //     let newImage = new Image(img);
    //     context.drawImage(newImage, 0, 0);
    // }

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
        point1              = new Point(x, y, colorLine, widthLine);
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
            point2       = new Point(x, y, colorLine, widthLine);
            let newPatch = new Path(point1.x, point1.y, point2.x, point2.y, point1.color, point1.width);
            point1       = point2;
            emit('continuePath', newPoint, newPatch, sessionID);
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


    namespace.on('startPath', function startPath(point, MYsessionID) {
        if (MYsessionID != sessionID) {
            webPainting = true;
        }
    });

    namespace.on('continuePath', function continuePath(point, path, MYsessionID) {
        if (MYsessionID != sessionID) {
            if (webPainting) {
                let currentPainter = new Painter(path.beginPointX, path.beginPointY, path.endPointX,
                    path.endPointY, path.color, path.width);
                currentPainter.paint();
            }
        }
    });

    namespace.on('endPath', function endPath(point, MYsessionID) {
        if (MYsessionID != sessionID) {
            webPainting    = false;
            const canvas1  = document.getElementById('paint-canvas');
            const context1 = canvas1.getContext('2d');
            context1.closePath();
        }
    });

    namespace.on('drawPoints', function drawPoints(pointsArray) {

        for (let i = 0; i < pointsArray.length; i++) {
            context.lineJoin = "round";
            context.beginPath();
            context.lineWidth   = pointsArray[i].width;
            context.strokeStyle = pointsArray[i].color;
            context.moveTo(pointsArray[i].beginPointX, pointsArray[i].beginPointY);
            context.lineTo(pointsArray[i].endPointX, pointsArray[i].endPointY);
            context.closePath();
            context.stroke();
        }

    });


    function getCookie(name) {
        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    //
    $("body").css("display", "block");

    $("body").fadeIn(1500);

    btnPaint.addEventListener('click', (ev) => {
        let widthLine = document.getElementById("brush_width").value;
        let colorLine = document.getElementById("color_selector").value;
        const x1      = document.getElementById('x1').value;
        const x2      = document.getElementById('x2').value;
        const y1      = document.getElementById('y1').value;
        const y2      = document.getElementById('y2').value;
        const figure  = new Painter(x1, y1, x2, y2, colorLine, widthLine);
        figure.paint();

    });

};
