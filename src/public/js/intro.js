window.onload = () => {
    //  let images = document.getElementsByTagName('img');
    //   const canvas  = document.getElementById('canvas1');
    //   const context = canvas.getContext('2d');
    //  const images     = document.getElementsByTagName('canvas');
    let canvasDivs = [];
    const btnAdd   = document.getElementById('btnAdd');

    btnAdd.addEventListener('click', () => {
        createCanvas();
        console.log(canvasDivs.length);
        getCanvasDivs();
    });

    let namespace = io('/namespace');
    namespace.on('connect', (socket) => {
        namespace.emit('getImage');
    });

    namespace.on('drawPreview', (data) => {
        console.log('drawImage emitted');
        getCanvasDivs();
        drawPreview(data);
    });

    namespace.on('setRooms', (divs) => {
        canvasDivs = [];
        for (let i = 0; i < divs; i++) {
            reloadCanvas();

        }
        getCanvasDivs();
        console.log('setRooms Emitted');
    });

    function drawPreview(data) {
        const images = document.getElementsByTagName('canvas');
        for (let i = 0; i < canvasDivs.length; i++) {

            for (let j = 0; j < data[i].length; j++) {
                const context    = images[i].getContext('2d');
                context.lineJoin = "round";
                context.beginPath();
                context.lineWidth   = data[i][j].width * 0.45;
                context.strokeStyle = data[i][j].color;
                context.moveTo(data[i][j].beginPointX * 0.45, data[i][j].beginPointY * 0.3);
                context.lineTo(data[i][j].endPointX * 0.45, data[i][j].endPointY * 0.3);
                context.closePath();
                context.stroke();
                //       context.moveTo(pointsArray[i].endPointX, pointsArray[i].endPointY);
            }

        }

    };


    // images[0].onclick = () => {
    //     console.log("image room 1 clicked");
    //     let rooms = io('/namespace');
    //     rooms.on('connect', () => {
    //         rooms.emit('img_click', {room: 1});
    //     });
    //
    //     rooms.on('joinRoom', (data) => {
    //
    //         document.cookie = "room=" + data.roomname;
    //         alert('Room ' + data.roomname + ' joined');
    //         newPage(data.location);
    //         //   window.location.replace(data.location)
    //         // location.assign(data.location);
    //     });
    //
    // }

    // images[1].onclick = () => {
    //     console.log("image room 2 clicked");
    //     let rooms = io('/namespace');
    //     rooms.on('connect', () => {
    //         rooms.emit('img_click', {room: 2});
    //     });
    //
    //     rooms.on('joinRoom', (data) => {
    //         document.cookie = "room=" + data.roomname;
    //         alert('Room ' + data.roomname + ' joined');
    //         newPage(data.location);
    //     });
    //
    //
    // }

    // images[2].onclick = () => {
    //     console.log("image room 3 clicked");
    //     let rooms = io('/namespace');
    //     rooms.on('connect', () => {
    //         rooms.emit('img_click', {room: 3});
    //     });
    //
    //     rooms.on('joinRoom', (data) => {
    //         document.cookie = "room=" + data.roomname;
    //         alert('Room ' + data.roomname + ' joined');
    //         newPage(data.location);
    //         location.assign(data.location);
    //     });
    // }

    // images[3].onclick = () => {
    //     console.log("image room 4 clicked");
    //     let rooms = io('/namespace');
    //     rooms.on('connect', () => {
    //         rooms.emit('img_click', {room: 4});
    //     });
    //
    //     rooms.on('joinRoom', (data) => {
    //         document.cookie = "room=" + data.roomname;
    //         alert('Room ' + data.roomname + ' joined');
    //         newPage(data.location);
    //         location.assign(data.location);
    //     });
    // }


    $("body").css("display", "none");

    $("body").fadeIn(2000);

    function redirectPage() {
        window.location = linkLocation;
    }

    function newPage(location) {
        linkLocation = location;
        $("body").fadeOut(1000, redirectPage);
    }


    function createCanvas() {
        let div        = document.createElement('div');
        let roomNumber = canvasDivs.length + 1;
        div.innerHTML  = "<h3>Room " + roomNumber + "<p>&dArr;</p></h3>" +
            "<canvas id=\"canvas2\" style=\"border:1px solid gray; cursor:pointer;\"></canvas>";
        canvasDivs.push(div);
        namespace.emit('createRoom', canvasDivs.length);

    }

    function reloadCanvas() {
        let div        = document.createElement('div');
        div.className = 'col';
        let roomNumber = canvasDivs.length + 1;
        div.innerHTML  = "<h3>Room " + roomNumber + "<p>&dArr;</p></h3>" +
            "<canvas id=\"canvas2\" style=\"border:1px solid gray; cursor:pointer;\"></canvas>";
        canvasDivs.push(div);
    }

    function getCanvasDivs() {
        let parentDiv = document.getElementById('parentDiv');
        for (let i = 0; i < canvasDivs.length; i++) {
            let div = canvasDivs[i];
            parentDiv.appendChild(div);
            addActionsCanvas();
        }
    }

    function addActionsCanvas() {
        const images = document.getElementsByTagName('canvas');
        for (let i = 0; i < images.length; i++) {
            let canvasElement = images[i];
            canvasElement.addEventListener('click', () => {
                console.log("image room" + [i + 1] + "clicked");
                let rooms = io('/namespace');
                rooms.on('connect', () => {
                    rooms.emit('img_click', {room: i + 1});
                });
                rooms.on('joinRoom', (data) => {
                    document.cookie = "room=" + data.roomname;
                    alert('Room ' + data.roomname + ' joined');
                    newPage(data.location);
                });

            });
        }
    }



}