window.onload = () => {
    const canvas  = document.getElementById('paint-canvas');
    const context = canvas.getContext('2d');
    // const socket  = io.connect('127.0.0.1:80');

    canvas.width  = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    context.lineJoin    = "round";
    context.strokeStyle = "black";
    console.log("Hello!");
    let x;
    let y;
    let painting = false;

    canvas.onmousedown = (e) => {
        context.beginPath();
        let widthLine = document.getElementById("brush_width").value;
        if (widthLine < 1 || widthLine > 10) {
            widthLine                                    = 5;
            document.getElementById("brush_width").value = 5;
        }
        context.lineWidth =
            context.strokeStyle = widthLine;
        painting = true;
        x        = e.offsetX;
        y        = e.offsetY;
        context.moveTo(x, y);
    };

    canvas.onmousemove = (e) => {
        if (painting) {
            context.lineTo(e.offsetX, e.offsetY);
            context.closePath();
            context.stroke();
            x = e.offsetX;
            y = e.offsetY;
            context.moveTo(x, y);
        }
    };

    canvas.onmouseup = canvas.onmouseleave = (e) => {
        painting = false;
        // let image = Image();
        // image.src = canvas.toDataURL();
        // let imgSend = image.toJSON();
        // socket.emit('change', imgSend);
    };
};



